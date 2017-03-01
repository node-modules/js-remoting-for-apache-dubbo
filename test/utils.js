'use strict';

const fs = require('fs');
const path = require('path');
const fixtures = path.join(__dirname, 'fixtures');

exports.bytes = name => {
  if (!name.endsWith('.bin')) {
    name += '.bin';
  }
  return fs.readFileSync(path.join(fixtures, name));
};

exports.write = (name, data, append) => {
  if (!name.endsWith('.bin')) {
    name += '.bin';
  }
  if (append) {
    fs.appendFileSync(path.join(fixtures, name), data);
  } else {
    fs.writeFileSync(path.join(fixtures, name), data);
  }
};

exports.createReadStream = name => {
  if (!name.endsWith('.bin')) {
    name += '.bin';
  }
  return fs.createReadStream(path.join(fixtures, name));
};
