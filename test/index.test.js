'use strict';

const is = require('is-type-of');
const stream = require('stream');
const utils = require('./utils');
const assert = require('assert');
const protocol = require('../');
const pedding = require('pedding');
const utility = require('utility');
const decode = require('../lib/protocol/dubbo').decode;

describe('test/index.test.js', () => {
  describe('exchange', () => {
    it('should create decoder ok', () => {
      let decoder = protocol.decode('dubbo://127.0.0.1');
      assert(decoder);
      assert(decoder instanceof stream.Writable);
      decoder.end();
      decoder = protocol.decode('exchange://127.0.0.1');
      assert(decoder);
      decoder.end();
    });

    it('should create decoder failed', () => {
      assert.throws(() => {
        protocol.decode('xxx://127.0.0.1');
      }, '[dubbo-remoting] unsupport protocol => xxx');
    });

    it('should decode single packet ok', done => {
      const decoder = protocol.decode('exchange://127.0.0.1');
      decoder.on('packet', packet => {
        assert(packet.id === 1);
        assert(packet.version === '2.0.0');
        assert(packet.isTwoWay);
        assert(!packet.isEvent);
        assert(!packet.isBroken);
        assert.deepEqual(packet.data, {
          login: {
            application: 'xxx',
            dubbo: '2.5.3',
            password: null,
            username: null,
          },
        });
        done();
      });
      utils.createReadStream('login').pipe(decoder);
    });

    it('should decode multiple packets ok', done => {
      done = pedding(done, 2);
      const decoder = protocol.decode('exchange://127.0.0.1');
      decoder.on('packet', packet => {
        if (packet.id === 1) {
          assert.deepEqual(packet.data, {
            login: {
              application: 'xxx',
              dubbo: '2.5.3',
              password: null,
              username: null,
            },
          });
        } else if (packet.id === 2) {
          assert.deepEqual(packet.data, {
            register: 'consumer://127.0.0.1?application=test&dubbo=2.5.3&check=false&pid=90972&protocol=dubbo&revision=1.0.0&timestamp=1487836024465&category=consumer&methods=*&side=consumer&interface=com.gxc.demo.DemoService&version=1.0.0',
          });
        } else {
          done(new Error(`error packet id => ${packet.id}`));
        }
        done();
      });
      utils.createReadStream('multiple').pipe(decoder);
    });

    it('should work with partial data', done => {
      const socket = new stream.Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          callback(null, chunk);
        },
      });
      const decoder = protocol.decode('exchange://127.0.0.1');
      decoder.on('packet', packet => {
        assert(packet.id === 1);
        assert(packet.version === '2.0.0');
        assert(packet.isTwoWay);
        assert(!packet.isEvent);
        assert(!packet.isBroken);
        assert.deepEqual(packet.data, {
          login: {
            application: 'xxx',
            dubbo: '2.5.3',
            password: null,
            username: null,
          },
        });
        done();
      });
      socket.pipe(decoder);
      const buf = utils.bytes('login');
      const length = buf.length;
      const index = utility.random(length);

      socket.write(buf.slice(0, index));

      setTimeout(() => {
        socket.write(buf.slice(index, length));
      }, 1000);
    });

    it('should emit error if decode failed', done => {
      const socket = new stream.Transform({
        writableObjectMode: true,
        transform(chunk, encoding, callback) {
          callback(null, chunk);
        },
      });
      const decoder = protocol.decode('exchange://127.0.0.1');
      decoder.on('error', err => {
        assert(err && err.message === '[dubbo-remoting] invalid packet with magic => 102');
        done();
      });
      socket.pipe(decoder);
      socket.write(new Buffer('fake data'));
    });

    it('should auto generate id', () => {
      const req = new protocol.Request();
      assert(is.number(req.id));
    });
  });

  describe('dubbo', () => {
    it('should encode & decode dubbo request', () => {
      const req = new protocol.Request(1);
      req.data = new protocol.Invocation({
        methodName: 'test-method',
        args: [
          1, true, 1.1, new Date(1487940805137), new Buffer('buffer'), [ 1, 2, 3 ], { a: 'a' },
        ],
        attachments: {
          dubbo: '5.3.0',
          path: 'com.test.TestService',
          version: '1.0.0',
        },
      });
      assert(!req.isResponse);
      const buf = req.encode();
      assert.deepEqual(buf, utils.bytes('dubbo_req'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, req);
    });

    it('should encode & decode java class', () => {
      const req = new protocol.Request(1);
      req.data = new protocol.Invocation({
        methodName: 'test-method',
        args: [{
          $class: 'com.test.TestClass',
          $: {
            a: 1,
            b: 'str',
            c: true,
            d: [ 'a', 'b', 'c' ],
            e: { foo: 'bar' },
          },
        }],
        attachments: {
          dubbo: '5.3.0',
          path: 'com.test.TestService',
          version: '1.0.0',
        },
      });
      const buf = req.encode();
      assert.deepEqual(buf, utils.bytes('dubbo_req_java_class'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert(result.packet.id === 1);
      const inv = result.packet.data;
      assert(inv.methodName === 'test-method');
      assert.deepEqual(inv.attachments, {
        dubbo: '5.3.0',
        path: 'com.test.TestService',
        version: '1.0.0',
      });
      assert.deepEqual(inv.args, [{
        a: 1,
        b: 'str',
        c: true,
        d: [ 'a', 'b', 'c' ],
        e: { foo: 'bar' },
      }]);
    });

    it('should encode & decode dubbo response', () => {
      const res = new protocol.Response(1);
      res.data = new protocol.Result({ value: 1.22 });
      assert(res.isSuccess);
      assert(res.isResponse);
      assert(!res.event);
      const buf = res.encode();
      assert.deepEqual(buf, utils.bytes('dubbo_res'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, res);
    });

    it('should encode & decode dubbo exception response', () => {
      const res = new protocol.Response(1);
      res.data = new protocol.Result({ error: new Error('mock error') });
      assert(res.isResponse);
      const buf = res.encode();
      const result = decode(buf);
      assert(result.total === buf.length);
      assert(result.packet.data.value == null);
      assert(result.packet.data.error instanceof Error);
      assert(result.packet.data.error.message.includes('mock error'));
    });

    it('should encode & decode return value => null', () => {
      const res = new protocol.Response(1);
      res.data = new protocol.Result({ value: null });
      assert(res.isResponse);
      const buf = res.encode();
      assert.deepEqual(buf, utils.bytes('dubbo_res_with_null'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, res);
    });

    it('should encode & decode packet with sys err', () => {
      const res = new protocol.Response(1);
      res.status = 70;
      res.errorMsg = 'sys error';
      assert(res.isResponse);
      const buf = res.encode();
      assert.deepEqual(buf, utils.bytes('dubbo_res_with_sys_error'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, res);
    });
  });

  describe('heartbeat', () => {
    it('should decode & encode heartbeat req', () => {
      const req = new protocol.Request(1);
      req.event = null;
      assert(!req.isResponse);
      assert(req.isHeartbeat);
      assert(req.event == null);
      const buf = req.encode();
      assert.deepEqual(buf, utils.bytes('heartbeat_req'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, req);
    });

    it('should decode & encode heartbeat res', () => {
      const res = new protocol.Response(1);
      res.event = null;
      assert(res.isResponse);
      assert(res.isHeartbeat);
      assert(res.event == null);
      const buf = res.encode();
      assert.deepEqual(buf, utils.bytes('heartbeat_res'));
      const result = decode(buf);
      assert(result.total === buf.length);
      assert.deepEqual(result.packet, res);
    });
  });
});
