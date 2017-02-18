'use strict';

const hessian = require('hessian.js');
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
  writeObject(v) {
    return encoder.write(v);
  },
};

exports.serialize = () => {
  encoder.reset();
  return output;
};
exports.deserialize = buf => {
  decoder.init(buf);
  return input;
};
