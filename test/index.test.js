'use strict';

const protocol = require('../');
const assert = require('assert');
const urlparse = require('url').parse;
const awaitEvent = require('await-event');
const PassThrough = require('stream').PassThrough;

describe('test/index.test.js', () => {

  it('should create encoder ok', () => {
    const sentReqs = new Map();
    const address = urlparse('dubbo://127.0.0.1:12200?serialization=hessian', true);
    let encoder = protocol.encoder({ address, sentReqs });
    assert(encoder.protocolType === 'dubbo');
    assert(encoder.codecType === 'hessian');

    encoder = protocol.encoder({ sentReqs });
    assert(encoder.protocolType === 'dubbo');
    assert(encoder.codecType === 'hessian2');

    encoder = protocol.encoder({ sentReqs, codecType: 'protobuf' });
    assert(encoder.protocolType === 'dubbo');
    assert(encoder.codecType === 'protobuf');

    encoder.codecType = 'hessian2';
    assert(encoder.codecType === 'hessian2');
  });

  const reqSample = {
    args: [ 1, 2 ],
    serverSignature: 'com.alipay.test.TestService:1.0',
    methodName: 'plus',
    requestProps: {
      foo: 'bar',
    },
    timeout: 3000,
  };
  const resSample = {
    isError: false,
    errorMsg: null,
    appResponse: {
      $class: 'java.lang.Integer',
      $: 3,
    },
  };

  it('should encode request', async function() {
    const codecType = 'hessian2';
    const protocolType = 'dubbo';
    const address = urlparse('dubbo://127.0.0.1:12200?serialization=hessian2');
    const sentReqs = new Map();
    const socket = new PassThrough();
    const encoder = protocol.encoder({ sentReqs, address });
    const decoder = protocol.decoder({ sentReqs });
    encoder.pipe(socket).pipe(decoder);

    setImmediate(() => {
      encoder.writeRequest(1, Object.assign({}, reqSample));
    });

    let req = await awaitEvent(decoder, 'request');
    assert(req.packetId === 1);
    assert(req.packetType === 'request');
    assert(req.data && req.data.methodName === reqSample.methodName);
    assert(req.data.serverSignature === reqSample.serverSignature);
    assert.deepEqual(req.data.args, reqSample.args);
    assert.deepEqual(req.data.requestProps, { dubbo: '5.3.0', path: 'com.alipay.test.TestService', version: '1.0', foo: 'bar' });
    assert(req.options && req.options.protocolType === protocolType);
    assert(req.options.codecType === codecType);
    assert(req.meta);
    assert(req.meta.size > 0);
    assert(req.meta.start > 0);
    assert(req.meta.rt >= 0);

    setImmediate(() => {
      encoder.writeRequest(2, Object.assign({}, reqSample));
    });

    req = await awaitEvent(decoder, 'request');
    assert(req.packetId === 2);
    assert(req.packetType === 'request');
    assert(req.data && req.data.methodName === reqSample.methodName);
    assert(req.data.serverSignature === reqSample.serverSignature);
    assert.deepEqual(req.data.args, reqSample.args);
    assert.deepEqual(req.data.requestProps, { dubbo: '5.3.0', path: 'com.alipay.test.TestService', version: '1.0', foo: 'bar' });
    assert(req.options && req.options.protocolType === protocolType);
    assert(req.options.codecType === codecType);
    assert(req.meta);
    assert(req.meta.size > 0);
    assert(req.meta.start > 0);
    assert(req.meta.rt >= 0);

    setImmediate(() => {
      encoder.writeResponse(req, resSample);
    });

    const res = await awaitEvent(decoder, 'response');
    assert(res.packetId === 2);
    assert(res.packetType === 'response');
    assert.deepEqual(res.data, { error: null, appResponse: 3, responseProps: null });
    assert(res.options && res.options.protocolType === protocolType);
    assert(res.options.codecType === codecType);
    assert(res.meta);
    assert(res.meta.size > 0);
    assert(res.meta.start > 0);
    assert(res.meta.rt >= 0);
  });

  it('should encode error response', async function() {
    const codecType = 'hessian2';
    const protocolType = 'dubbo';
    const address = urlparse('dubbo://127.0.0.1:12200?serialization=hessian2');
    const sentReqs = new Map();
    const socket = new PassThrough();
    const encoder = protocol.encoder({ sentReqs, address });
    const decoder = protocol.decoder({ sentReqs });
    encoder.pipe(socket).pipe(decoder);

    setImmediate(() => {
      encoder.writeRequest(1, {
        args: [ 1, 2 ],
        serverSignature: 'com.alipay.test.TestService:1.0',
        methodName: 'plus',
        requestProps: null,
        timeout: 3000,
      }, err => {
        err && console.log(err);
      });
    });

    const req = await awaitEvent(decoder, 'request');

    setImmediate(() => {
      encoder.writeResponse(req, {
        isError: true,
        errorMsg: 'mock error message',
        appResponse: null,
      });
    });
    let res = await awaitEvent(decoder, 'response');

    assert(res.packetId === 1);
    assert(res.packetType === 'response');
    assert(res.options && res.options.protocolType === protocolType);
    assert(res.options.codecType === codecType);
    assert(res.data && res.data.error);
    assert(!res.data.appResponse);
    assert(res.data.error.message.includes('mock error message'));

    req.options.protocolType = 'dubbo';
    req.options.codecType = 'hessian2';

    setImmediate(() => {
      encoder.writeResponse(req, {
        isError: true,
        errorMsg: 'xxx error',
        appResponse: null,
      });
    });
    res = await awaitEvent(decoder, 'response');
    assert(res.packetId === 1);
    assert(res.packetType === 'response');
    assert(res.options && res.options.protocolType === 'dubbo');
    assert(res.options.codecType === 'hessian2');
    assert(res.data && res.data.error);
    assert(!res.data.appResponse);
    assert(res.data.error.message.includes('xxx error'));

    setImmediate(() => {
      encoder.writeResponse(req, {
        isError: true,
        errorMsg: null,
        appResponse: null,
      });
    });
    res = await awaitEvent(decoder, 'response');
    assert(res.packetId === 1);
    assert(res.packetType === 'response');
    assert(res.options && res.options.protocolType === 'dubbo');
    assert(res.options.codecType === 'hessian2');
    assert(res.data && res.data.error);
    assert(!res.data.appResponse);
    assert(res.data.error.message.includes('Exception caught in invocation'));
  });

  it('should encode biz error response', async function() {
    const codecType = 'hessian2';
    const protocolType = 'dubbo';
    const address = urlparse('dubbo://127.0.0.1:12200?serialization=hessian2');
    const sentReqs = new Map();
    const socket = new PassThrough();
    const encoder = protocol.encoder({ sentReqs, address });
    const decoder = protocol.decoder({ sentReqs });
    encoder.pipe(socket).pipe(decoder);

    setImmediate(() => {
      encoder.writeRequest(1, {
        args: [ 1, 2 ],
        serverSignature: 'com.alipay.test.TestService:1.0',
        methodName: 'plus',
        requestProps: null,
        uniformContextHeaders: null,
        timeout: 3000,
      });
    });
    const req = await awaitEvent(decoder, 'request');

    setImmediate(() => {
      encoder.writeResponse(req, {
        isError: false,
        errorMsg: null,
        appResponse: {
          $class: 'java.lang.Exception',
          $: new Error('mock error'),
        },
      });
    });
    const res = await awaitEvent(decoder, 'response');

    assert(res.packetId === 1);
    assert(res.packetType === 'response');
    assert(res.options && res.options.protocolType === protocolType);
    assert(res.options.codecType === codecType);
    assert(res.data && res.data.error);
    assert(!res.data.appResponse);
    assert(res.data.error.message.includes('mock error'));
  });

  describe('heartbeat', () => {
    it('should encode heartbeat', async function() {
      const codecType = 'hessian2';
      const protocolType = 'dubbo';
      const address = urlparse('dubbo://127.0.0.1:12200?serialization=hessian2');
      const sentReqs = new Map();
      const socket = new PassThrough();
      const encoder = protocol.encoder({ sentReqs, address });
      const decoder = protocol.decoder({ sentReqs });
      encoder.pipe(socket).pipe(decoder);

      setImmediate(() => {
        encoder.writeHeartbeat(1, { clientUrl: 'xxx' });
      });
      const hb = await awaitEvent(decoder, 'heartbeat');

      assert(hb.packetId === 1);
      assert(hb.packetType === 'heartbeat');
      assert(hb.options && hb.options.protocolType === protocolType);
      assert(hb.options.codecType === codecType);

      setImmediate(() => {
        encoder.writeHeartbeatAck(hb);
      });

      const hbAck = await awaitEvent(decoder, 'heartbeat_ack');
      assert(hbAck.packetId === 1);
      assert(hbAck.packetType === 'heartbeat_ack');
      assert(hbAck.options && hbAck.options.protocolType === protocolType);
      assert(hbAck.options.codecType === codecType);
    });
  });
});
