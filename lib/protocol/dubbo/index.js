'use strict';

const Long = require('long');
const utils = require('../../utils');
const Request = require('./request');
const Response = require('./response');

const HEADER_LENGTH = 16;
const FLAG_REQUEST = 0x80;

exports.decode = buf => {
  const bufSize = buf.length;
  if (bufSize < HEADER_LENGTH) {
    return;
  }
  const bodyLen = buf.readInt32BE(12);
  const total = bodyLen + HEADER_LENGTH;
  if (bufSize < total) {
    return;
  }
  const flag = buf[2];
  const id = utils.handleLong(new Long(
    buf.readInt32BE(8), // low, high
    buf.readInt32BE(4)
  ));
  const packet = (flag & FLAG_REQUEST) === 0 ? new Response(id) : new Request(id);
  packet.decode(buf);
  return {
    packet,
    total,
  };
};

exports.encode = (msg, sType) => {
  return msg.encode(sType);
};
