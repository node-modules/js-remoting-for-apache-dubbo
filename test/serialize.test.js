'use strict';

const assert = require('assert');
const serialization = require('../lib/serialize');

describe('test/serialize.test.js', () => {
  it('should getSerializationById & getSerializationByName', () => {
    assert(serialization.getSerializationById('2'));
    assert(serialization.getSerializationByName('hessian2'));
  });

  describe('hessian2', () => {
    it('should readBool & writeBool ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeBool(true);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readBool() === true);
    });

    it('should readByte & writeByte ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeByte(10);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readByte() === 10);
    });

    it('should readShort & writeShort ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeShort(10);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readShort() === 10);
    });

    it('should readInt & writeInt ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeInt(10);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readInt() === 10);
    });

    it('should readLong & writeLong ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeLong(10);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readLong() === 10);
    });

    it('should readFloat & writeFloat ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeFloat(10.1);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readFloat() === 10.1);
    });

    it('should readDouble & writeDouble ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeDouble(10.1);
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert(input.readDouble() === 10.1);
    });

    it('should readBytes & writeBytes ok', () => {
      const output = serialization.getSerializationById('2').serialize();
      output.writeBytes(new Buffer('hello buffer'));
      const input = serialization.getSerializationById('2').deserialize(output.get());
      assert.deepEqual(input.readBytes(), new Buffer('hello buffer'));
    });
  });
});
