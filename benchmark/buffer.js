'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const utils = require('../lib/utils');
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();

const buf_1 = fs.readFileSync(path.join(__dirname, '../test/fixtures/dubbo_req.bin'));
const buf_2 = fs.readFileSync(path.join(__dirname, '../test/fixtures/dubbo_req_java_class.bin'));

assert.deepEqual(Buffer.concat([buf_1, buf_2]), utils.concatBuffer(buf_1, buf_2));

// add tests
suite
  .add('Buffer.concat()', function() {
    Buffer.concat([buf_1, buf_2]);
  })
  .add('Buffer.copy()', function() {
    utils.concatBuffer(buf_1, buf_2);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function() {
    console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
  })
  .on('complete', function done() {
    benchmarks.log();
  })
  .run({ async: false });
