/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
const total = buf_1.length + buf_2.length;

assert.deepEqual(Buffer.concat([buf_1, buf_2]), utils.concatBuffer(buf_1, buf_2));

// add tests
suite
  .add('Buffer.concat()', function() {
    Buffer.concat([buf_1, buf_2]);
  })
  .add('Buffer.concat() with size', function() {
    Buffer.concat([buf_1, buf_2], total);
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
