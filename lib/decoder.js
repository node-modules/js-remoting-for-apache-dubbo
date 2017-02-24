'use strict';

const is = require('is-type-of');
const assert = require('assert');
const urlparse = require('url').parse;
const Writable = require('stream').Writable;

// 协议实现
const protocolMap = {
  dubbo: require('./protocol/dubbo'),
  exchange: require('./protocol/dubbo'),
};

class DubboDecoder extends Writable {
  constructor(options) {
    assert(options && is.string(options.url), '[dubbo-remoting] options.url is required');
    super(options);
    this._buf = null;
    this._url = urlparse(options.url, true);
    let proto = this._url.protocol;
    proto = proto.endsWith(':') ? proto.slice(0, -1) : proto;
    this._protocol = protocolMap[proto];
    assert(this._protocol, `[dubbo-remoting] unsupport protocol => ${proto}`);
  }

  /**
   * 根据 url 返回匹配的协议
   *
   * @property {Object} DubboDecoder#protocol
   */
  get protocol() {
    return this._protocol;
  }

  _write(chunk, encoding, callback) {
    // merge old & new bytes
    this._buf = this._buf ? Buffer.concat([ this._buf, chunk ]) : chunk;
    try {
      let unfinish = false;
      do {
        unfinish = this._decode();
      } while (unfinish);
      callback();
    } catch (err) {
      callback(err);
    }
  }

  _decode() {
    const ret = this.protocol.decode(this._buf);
    if (ret) {
      // 这里异步化是为了避免 listeners 业务报错影响到 decoder
      process.nextTick(() => { this.emit('packet', ret.packet); });

      const bufSize = this._buf.length;
      const rest = bufSize - ret.total;
      if (rest > 0) {
        this._buf = this._buf.slice(ret.total);
        return true;
      }
      this._buf = null;
    }
    return false;
  }
}

module.exports = DubboDecoder;
