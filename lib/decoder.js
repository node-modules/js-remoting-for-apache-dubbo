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

const protocol = require('./protocol');
const Writable = require('stream').Writable;

const HEADER_LENGTH = 16;

class DubboDecoder extends Writable {
  constructor(options = {}) {
    super(options);
    this._buf = null;
    this.options = options;
  }

  _write(chunk, encoding, callback) {
    // 合并 buf 中的数据
    this._buf = this._buf ? Buffer.concat([ this._buf, chunk ]) : chunk;
    try {
      let unfinish = false;
      do {
        unfinish = this._decode();
      } while (unfinish);
      callback();
    } catch (err) {
      err.name = 'DubboDecodeError';
      err.data = this._buf ? this._buf.toString('base64') : '';
      callback(err);
    }
  }

  _decode() {
    const bufLength = this._buf.length;

    if (bufLength < HEADER_LENGTH) {
      return false;
    }
    const bodyLen = this._buf.readInt32BE(12);
    const packetLength = bodyLen + HEADER_LENGTH;
    if (packetLength === 0 || bufLength < packetLength) {
      return false;
    }
    const packet = this._buf.slice(0, packetLength);
    // 调用反序列化方法获取对象
    const obj = protocol.decode(packet, this.options);
    this.emit(obj.packetType, obj);
    const restLen = bufLength - packetLength;
    if (restLen) {
      this._buf = this._buf.slice(packetLength);
      return true;
    }
    this._buf = null;
    return false;
  }

  _destroy() {
    this._buf = null;
    this.emit('close');
  }
}

module.exports = DubboDecoder;
