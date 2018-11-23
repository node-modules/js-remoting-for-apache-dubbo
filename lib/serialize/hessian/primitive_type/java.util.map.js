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

const utils = require('../utils');

module.exports = (gen, classInfo, version) => {
  gen('if (obj == null) { return encoder.writeNull(); }');
  gen('if (encoder._checkRef(obj)) { return; }');

  if (version === '1.0') {
    gen('encoder.byteBuffer.put(0x4d);');
  } else {
    gen('encoder.byteBuffer.put(0x48);');
  }
  if (classInfo.type === 'java.util.HashMap' || classInfo.type === 'java.util.Map') {
    gen('encoder.writeType(\'\');');
  } else {
    gen('encoder.writeType(\'%s\');', classInfo.type);
  }

  const generic = classInfo.generic;
  if (generic && generic.length === 2) {
    gen('if (obj instanceof Map) {');
    gen('  for (const entry of obj.entries()) {');
    gen('    const key = entry[0];');
    gen('    const value = entry[1];');
    const genericKeyDefine = utils.normalizeType(generic[0]);
    const genericValueDefine = utils.normalizeType(generic[1]);
    const keyId = utils.normalizeUniqId(genericKeyDefine, version);
    const valueId = utils.normalizeUniqId(genericValueDefine, version);
    gen('    const encodeKey = compile(\'%s\', %j, classMap, version); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine);
    gen('    const encodeValue = compile(\'%s\', %j, classMap, version); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine);
    gen('  }\n  } else {');
    gen('  for (const key in obj) {');
    gen('    const value = obj[key];');
    const convertor = utils.converts[genericKeyDefine.type];
    if (convertor) {
      gen('    const encodeKey = compile(\'%s\', %j, classMap, version); encodeKey(%s(key), encoder, appClassMap);', keyId, genericKeyDefine, convertor);
    } else {
      gen('    const encodeKey = compile(\'%s\', %j, classMap, version); encodeKey(key, encoder, appClassMap);', keyId, genericKeyDefine);
    }
    gen('    const encodeValue = compile(\'%s\', %j, classMap, version); encodeValue(value, encoder, appClassMap);', valueId, genericValueDefine);
    gen('  }\n  }');
  } else {
    gen('if (obj instanceof Map) {');
    gen('  for (const entry of obj.entries()) {');
    gen('    const key = entry[0];');
    gen('    const value = entry[1];');
    gen('    encoder.writeString(key);');
    gen('    if (value && value.$class) {');
    gen('      const fnKey = utils.normalizeUniqId(value, version);');
    gen('      compile(fnKey, value, appClassMap, version)(value.$, encoder);');
    gen('    } else {');
    gen('      encoder.write(value);');
    gen('    }');
    gen('  }\n  } else {');
    gen('  for (const key in obj) {');
    gen('    const value = obj[key];');
    gen('    encoder.writeString(key);');
    gen('    if (value && value.$class) {');
    gen('      const fnKey = utils.normalizeUniqId(value, version);');
    gen('      compile(fnKey, value, appClassMap, version)(value.$, encoder);');
    gen('    } else {');
    gen('      encoder.write(value);');
    gen('    }');
    gen('  }\n  }');
  }
  if (version === '1.0') {
    gen('encoder.byteBuffer.put(0x7a);');
  } else {
    gen('encoder.byteBuffer.put(0x5a);');
  }
};
