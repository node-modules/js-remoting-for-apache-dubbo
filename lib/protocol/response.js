/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Long = require('long');
const utils = require('../utils');
const Constants = require('../const');
const getSerializationById = require('../serialize').getSerializationById;
const getSerializationByName = require('../serialize').getSerializationByName;

const HEADER_LENGTH = 16;
const MAGIC_HIGH = 0xda;
const MAGIC_LOW = 0xbb;
const FLAG_EVENT = 0x20;
const HEARTBEAT_EVENT = null;
const SERIALIZATION_MASK = 0x1f;

const RESPONSE_WITH_EXCEPTION = 0;
const RESPONSE_VALUE = 1;
const RESPONSE_NULL_VALUE = 2;
const RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS = 3;
const RESPONSE_VALUE_WITH_ATTACHMENTS = 4;
const RESPONSE_NULL_VALUE_WITH_ATTACHMENTS = 5;

class Response {
  constructor(id) {
    this.id = id;
    this.version = null;
    this.status = Response.OK;
    this.errorMsg = null;
    this.data = null;
    this.isEvent = false;
  }

  get isSuccess() {
    return this.status === Response.OK;
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

  encode(options = {}) {
    const { codecType, classMap } = options;
    const output = getSerializationByName(codecType || Constants.DEFAULT_REMOTING_SERIALIZATION).serialize();
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
      if (this.data) {
        if (this.data instanceof Error || (this.data.$class && this.data.$class.includes('Exception'))) {
          output.writeByte(RESPONSE_WITH_EXCEPTION);
          output.writeObject(this.data.$class ? this.data : {
            $class: 'java.lang.Exception',
            $: this.data,
          }, classMap);
        } else {
          if (this.data) {
            output.writeByte(RESPONSE_VALUE);
            output.writeObject(this.data, classMap);
          } else {
            output.writeByte(RESPONSE_NULL_VALUE);
          }
        }
      } else {
        output.writeObject(this.data, classMap);
      }
    } else {
      output.writeUTF(this.errorMsg || 'Exception caught in invocation');
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

    let packetType = 'response';
    if ((flag & FLAG_EVENT) !== 0) {
      packetType = 'heartbeat_ack';
    }
    const status = buf[3];
    let data = null;
    if (status === Response.OK) {
      if (packetType === 'heartbeat_ack') {
        data = input.readObject();
      } else {
        data = {
          appResponse: null,
          error: null,
          responseProps: null,
        };
        const rFlag = input.readObject();
        switch (rFlag) {
          case RESPONSE_NULL_VALUE:
            break;
          case RESPONSE_VALUE:
            data.appResponse = input.readObject();
            break;
          case RESPONSE_WITH_EXCEPTION:
            data.error = input.readObject();
            break;
          case RESPONSE_NULL_VALUE_WITH_ATTACHMENTS:
            data.responseProps = input.readObject();
            break;
          case RESPONSE_VALUE_WITH_ATTACHMENTS:
            data.appResponse = input.readObject();
            data.responseProps = input.readObject();
            break;
          case RESPONSE_WITH_EXCEPTION_WITH_ATTACHMENTS:
            data.error = input.readObject();
            data.responseProps = input.readObject();
            break;
          default:
            throw new Error('Unknown result flag, expect 0/1/2/3/4/5, get ' + rFlag);
        }
      }
    } else {
      const errorMsg = input.readUTF();
      data = {
        appResponse: null,
        error: new Error(errorMsg),
      };
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
