'use strict';

const Result = require('./result');
const Constants = require('../../const');
const getSerializationById = require('../../serialize').getSerializationById;
const getSerializationByName = require('../../serialize').getSerializationByName;

const HEADER_LENGTH = 16;
const MAGIC_HIGH = 0xda;
const MAGIC_LOW = 0xbb;
const FLAG_EVENT = 0x20;
const HEARTBEAT_EVENT = null;
const SERIALIZATION_MASK = 0x1f;
const RESPONSE_NULL_VALUE = 2;
const RESPONSE_VALUE = 1;
const RESPONSE_WITH_EXCEPTION = 0;

class Response {
  constructor(id) {
    this.id = id;
    this.version = null;
    this.status = Response.OK;
    this.errorMsg = null;
    this.data = {};
    this.isEvent = false;
  }

  get isResponse() {
    return true;
  }

  get event() {
    return this.isEvent ? this.data : null;
  }

  set event(val) {
    this.isEvent = true;
    this.data = val;
  }

  get isHeartbeat() {
    return this.isEvent && this.event === HEARTBEAT_EVENT;
  }

  encode(sType) {
    sType = sType || Constants.DEFAULT_REMOTING_SERIALIZATION;
    const output = getSerializationByName(sType).serialize();
    const bytes = output.bytes;

    bytes.put(MAGIC_HIGH);
    bytes.put(MAGIC_LOW);
    let flag = output.contentTypeId;
    if (this.isHeartbeat) {
      flag |= FLAG_EVENT;
    }
    bytes.put(flag);
    bytes.put(this.status);
    bytes.putLong(this.id);
    bytes.skip(4);

    if (this.status === Response.OK) {
      if (this.data instanceof Result) {
        if (this.data.error) {
          output.writeByte(RESPONSE_WITH_EXCEPTION);
          output.writeObject(this.data.error);
        } else {
          const ret = this.data.value;
          if (ret) {
            output.writeByte(RESPONSE_VALUE);
            output.writeObject(ret);
          } else {
            output.writeByte(RESPONSE_NULL_VALUE);
          }
        }
      } else {
        output.writeObject(this.data);
      }
    } else {
      output.writeUTF(this.errorMsg);
    }
    const bodyLen = bytes.position() - HEADER_LENGTH;
    bytes._bytes.writeInt32BE(bodyLen, 12);
    return output.get();
  }

  decode(buf) {
    const flag = buf[2];
    const sType = flag & SERIALIZATION_MASK;
    const input = getSerializationById(sType).deserialize(buf);
    // skip header
    input.skip(16);

    if ((flag & FLAG_EVENT) !== 0) {
      this.event = HEARTBEAT_EVENT;
    }
    this.status = buf[3];
    if (this.status === Response.OK) {
      if (this.isHeartbeat) {
        this.data = input.readObject();
      } else {
        const rFlag = input.readObject();
        if (rFlag === RESPONSE_VALUE) {
          this.data = {
            value: input.readObject(),
            error: null,
          };
        } else if (rFlag === RESPONSE_WITH_EXCEPTION) {
          this.data = {
            value: null,
            error: input.readObject(),
          };
        } else if (rFlag === RESPONSE_NULL_VALUE) {
          this.data = null;
        } else {
          this.data = rFlag;
        }
      }
    } else {
      this.errorMsg = input.readUTF();
    }
  }
}

Response.OK = 20;
Response.CLIENT_TIMEOUT = 30;
Response.SERVER_TIMEOUT = 31;
Response.BAD_REQUEST = 40;
Response.BAD_RESPONSE = 50;
Response.SERVICE_NOT_FOUND = 60;
Response.SERVICE_ERROR = 70;
Response.SERVER_ERROR = 80;
Response.CLIENT_ERROR = 90;

module.exports = Response;
