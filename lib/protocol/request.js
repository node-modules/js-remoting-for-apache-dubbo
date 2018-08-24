'use strict';

const Long = require('long');
const is = require('is-type-of');
const utils = require('../utils');
const Constants = require('../const');
const Invocation = require('./invocation');
const getSerializationById = require('../serialize').getSerializationById;
const getSerializationByName = require('../serialize').getSerializationByName;

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

  encode(options = {}) {
    const { codecType, classMap } = options;
    const output = getSerializationByName(codecType || Constants.DEFAULT_REMOTING_SERIALIZATION).serialize();
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

    // data 如果是 invocation 需要特殊处理下，其余的当 hashmap 处理
    if (this.data instanceof Invocation) {
      const inv = this.data;
      output.writeUTF(inv.attachments[Constants.DUBBO_VERSION_KEY] || DUBBO_VERSION);
      output.writeUTF(inv.attachments[Constants.PATH_KEY]);
      output.writeUTF(inv.attachments[Constants.VERSION_KEY]);

      output.writeUTF(inv.methodName);
      output.writeUTF(utils.getJavaArgsDesc(inv.args));

      for (const arg of inv.args) {
        output.writeObject(arg, classMap);
      }
      output.writeObject(inv.attachments, classMap);
    } else {
      output.writeObject(this.data, classMap);
    }
    const bodyLen = bytes.position() - HEADER_LENGTH;
    bytes._bytes.writeInt32BE(bodyLen, 12);
    return output.get();
  }

  static decode(buf, options = {}) {
    const packetId = utils.handleLong(new Long(
      buf.readInt32BE(8), // low, high
      buf.readInt32BE(4)
    ));

    const flag = buf[2];
    const sType = flag & SERIALIZATION_MASK;
    const input = getSerializationById(sType).deserialize(buf);
    // skip header
    input.skip(16);

    let packetType = 'request';
    let data;
    if ((flag & FLAG_EVENT) !== 0) {
      packetType = 'heartbeat';
      data = input.readObject();
    } else {
      const field = input.readObject();
      if (is.string(field)) {
        const attachments = {
          [Constants.DUBBO_VERSION_KEY]: field,
          [Constants.PATH_KEY]: input.readUTF(),
          [Constants.VERSION_KEY]: input.readUTF(),
        };
        const methodName = input.readUTF();
        const desc = input.readUTF();
        const methodArgSigs = utils.desc2classArray(desc);
        const argLen = methodArgSigs.length;
        const args = [];

        for (let i = 0; i < argLen; ++i) {
          args.push(input.readObject());
        }
        Object.assign(attachments, input.readObject());

        const serverSignature = attachments.version ? `${attachments.path}:${attachments.version}` : attachments.path;
        data = {
          methodName,
          serverSignature,
          args,
          methodArgSigs,
          requestProps: attachments,
        };
      } else {
        data = field;
      }
    }

    return {
      packetId,
      packetType,
      data,
      options: {
        protocolType: 'dubbo',
        codecType: 'hessian2',
        classMap: options.classMap,
      },
      meta: null,
    };
  }
}

module.exports = Request;
