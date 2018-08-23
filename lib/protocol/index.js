'use strict';

const Request = require('./request');
const Response = require('./response');
const Invocation = require('./invocation');

exports.requestEncode = (id, data, options) => {
  const req = new Request(id);
  const arr = data.serverSignature.split(':');
  let serviceName = data.serverSignature;
  let version = '1.0.0';
  if (arr.length === 2) {
    serviceName = arr[0];
    version = arr[1];
  }
  req.data = new Invocation({
    methodName: data.methodName,
    args: data.args,
    attachments: Object.assign({
      dubbo: '5.3.0',
      path: serviceName,
      version,
    }, data.requestProps),
  });
  return req.encode(options);
};

exports.responseEncode = (id, data, options) => {
  const res = new Response(id);
  res.status = data.isError ? Response.SERVER_ERROR : Response.OK;
  res.errorMsg = data.errorMsg;
  res.data = data.appResponse;
  return res.encode(options);
};

exports.heartbeatEncode = (id, hb, options) => {
  const req = new Request(id);
  req.event = null;
  return req.encode(options);
};

exports.heartbeatAckEncode = (id, options) => {
  const res = new Response(id);
  res.event = null;
  return res.encode(options);
};

const FLAG_REQUEST = 0x80;

/**
 * 反序列化
 * @param {ByteBuffer} buf - 二进制
 * @param {Object}  options
 *   - {Map} reqs - 请求集合
 *   - {Object} [classCache] - 类定义缓存
 * @return {Object} 反序列化后的对象
 */
exports.decode = (buf, options) => {
  const start = Date.now();

  const bufSize = buf.length;
  const flag = buf[2];
  const ret = (flag & FLAG_REQUEST) === 0 ?
    Response.decode(buf, options) :
    Request.decode(buf, options);

  ret.meta = {
    size: bufSize,
    start,
    rt: Date.now() - start,
  };
  return ret;
};
