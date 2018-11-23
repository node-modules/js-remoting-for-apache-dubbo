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

const hessian = require('hessian.js');
const compile = require('./compile');
const encoder = hessian.encoderV2;
const decoder = new hessian.DecoderV2();

const input = {
  skip(n) {
    decoder.byteBuffer.skip(n);
  },
  readBool() {
    return decoder.readBool();
  },
  readByte() {
    return decoder.readInt();
  },
  readShort() {
    return decoder.readInt();
  },
  readInt() {
    return decoder.readInt();
  },
  readLong() {
    return decoder.readLong();
  },
  readFloat() {
    return decoder.readDouble();
  },
  readDouble() {
    return decoder.readDouble();
  },
  readBytes() {
    return decoder.readBytes();
  },
  readUTF() {
    return decoder.readString();
  },
  readObject() {
    return decoder.read();
  },
};
const output = {
  get bytes() {
    return encoder.byteBuffer;
  },
  get contentTypeId() {
    return 2;
  },
  get() {
    return encoder.get();
  },
  writeBool(v) {
    return encoder.writeBool(v);
  },
  writeByte(v) {
    return encoder.writeInt(v);
  },
  writeShort(v) {
    return encoder.writeInt(v);
  },
  writeInt(v) {
    return encoder.writeInt(v);
  },
  writeLong(v) {
    return encoder.writeLong(v);
  },
  writeFloat(v) {
    return encoder.writeDouble(v);
  },
  writeDouble(v) {
    return encoder.writeDouble(v);
  },
  writeBytes(v) {
    return encoder.writeBytes(v);
  },
  writeUTF(v) {
    return encoder.writeString(v);
  },
  writeObject(v, classMap) {
    if (v && v.$class) {
      compile(v, '2.0', classMap)(v.$, encoder);
    } else {
      encoder.write(v);
    }
  },
};

exports.serialize = () => {
  encoder.reset();
  return output;
};
exports.deserialize = buf => {
  decoder.clean();
  decoder.init(buf);
  return input;
};
