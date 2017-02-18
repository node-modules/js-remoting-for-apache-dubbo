'use strict';

const DubboDecoder = require('./lib/decoder');
const Result = require('./lib/protocol/dubbo/result');
const Request = require('./lib/protocol/dubbo/request');
const Response = require('./lib/protocol/dubbo/response');
const Invocation = require('./lib/protocol/dubbo/invocation');

/**
 * get dubbo decoder
 *
 * @param {String} url - the url
 * @return {DubboDecoder} decoder
 */
exports.decode = url => {
  return new DubboDecoder({ url });
};

exports.DubboDecoder = DubboDecoder;
exports.Result = Result;
exports.Request = Request;
exports.Response = Response;
exports.Invocation = Invocation;
