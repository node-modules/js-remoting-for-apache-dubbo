'use strict';

const assert = require('assert');
const utils = require('../lib/utils');

describe('test/utils.test.js', () => {
  it('should getJavaArgsDesc & desc2classArray ok', () => {
    const desc = utils.getJavaArgsDesc([
      1, 1.22, 'a', true, null, undefined, 12323123123123,
      new Error('error'), new Date(), new Buffer('buffer'),
      { foo: 'bar' }, {
        $class: 'testClass',
        $: {},
      }, {
        $class: '[boolean',
        $: [ true ],
      }, {
        $class: 'long',
        $: 1,
      },
    ]);
    assert(desc === 'IDLjava/lang/String;ZLjava/lang/Object;Ljava/lang/Object;JLjava/lang/Exception;Ljava/util/Date;[BLjava/util/HashMap;LtestClass;[ZJ');
    const types = utils.desc2classArray(desc);
    assert.deepEqual(types, [
      'int',
      'double',
      'java.lang.String',
      'boolean',
      'java.lang.Object',
      'java.lang.Object',
      'long',
      'java.lang.Exception',
      'java.util.Date',
      '[byte',
      'java.util.HashMap',
      'testClass',
      '[boolean',
      'long',
    ]);
  });

  it('should desc2classArray ok', () => {
    assert.deepEqual(utils.desc2classArray('V'), [ 'void' ]);
    assert.deepEqual(utils.desc2classArray('Z'), [ 'boolean' ]);
    assert.deepEqual(utils.desc2classArray('B'), [ 'byte' ]);
    assert.deepEqual(utils.desc2classArray('C'), [ 'char' ]);
    assert.deepEqual(utils.desc2classArray('D'), [ 'double' ]);
    assert.deepEqual(utils.desc2classArray('F'), [ 'float' ]);
    assert.deepEqual(utils.desc2classArray('I'), [ 'int' ]);
    assert.deepEqual(utils.desc2classArray('J'), [ 'long' ]);
    assert.deepEqual(utils.desc2classArray('S'), [ 'short' ]);
    assert.throws(() => {
      utils.desc2classArray('A');
    }, /\[double-remoting\] unknown class type => A/);
  });
});
