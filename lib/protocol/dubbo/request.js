'use strict';

const is = require('is-type-of');
const utils = require('../../utils');
const Constants = require('../../const');
const Invocation = require('./invocation');
const getSerializationById = require('../../serialize').getSerializationById;
const getSerializationByName = require('../../serialize').getSerializationByName;

const DUBBO_VERSION = '2.5.3';
const HEADER_LENGTH = 16;
const MAGIC_HIGH = 0xda;
const MAGIC_LOW = 0xbb;
const FLAG_EVENT = 0x20;
const FLAG_TWOWAY = 0x40;
const FLAG_REQUEST = 0x80;
const HEARTBEAT_EVENT = null;
const SERIALIZATION_MASK = 0x1f;

class Request {
  constructor(id) {
    this.id = id != null ? id : utils.newId();
    this.version = '2.0.0';
    this.isTwoWay = true;
    this.isEvent = false;
    this.isBroken = false;
    this.data = null;
  }

  get isResponse() {
    return false;
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
    let flag = FLAG_REQUEST | output.contentTypeId;
    if (this.isTwoWay) {
      flag |= FLAG_TWOWAY;
    }
    if (this.isEvent) {
      flag |= FLAG_EVENT;
    }
    bytes.put(flag);
    bytes.put(0);
    bytes.putLong(this.id);
    bytes.skip(4);

    if (this.data instanceof Invocation) {
      const inv = this.data;
      output.writeUTF(inv.attachments[Constants.DUBBO_VERSION_KEY] || DUBBO_VERSION);
      output.writeUTF(inv.attachments[Constants.PATH_KEY]);
      output.writeUTF(inv.attachments[Constants.VERSION_KEY]);

      output.writeUTF(inv.methodName);
      output.writeUTF(utils.getJavaArgsDesc(inv.args));

      for (const arg of inv.args) {
        output.writeObject(arg);
      }
      output.writeObject(inv.attachments);
    } else {
      output.writeObject(this.data);
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

    this.isTwoWay = (flag & FLAG_TWOWAY) !== 0;
    if ((flag & FLAG_EVENT) !== 0) {
      this.event = HEARTBEAT_EVENT;
    }
    if (this.isEvent) {
      this.data = input.readObject();
    } else {
      const data = input.readObject();
      if (is.string(data)) {
        const attachments = {
          [Constants.DUBBO_VERSION_KEY]: data,
          [Constants.PATH_KEY]: input.readUTF(),
          [Constants.VERSION_KEY]: input.readUTF(),
        };
        const methodName = input.readUTF();
        const desc = input.readUTF();
        const parameterTypes = utils.desc2classArray(desc);
        const argLen = parameterTypes.length;
        const args = [];

        for (let i = 0; i < argLen; ++i) {
          args.push(input.readObject());
        }

        Object.assign(attachments, input.readObject());

        this.data = new Invocation({
          methodName,
          // parameterTypes,
          args,
          attachments,
        });
      } else {
        this.data = data;
      }
    }
  }
}

module.exports = Request;
