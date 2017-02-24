'use strict';

const is = require('is-type-of');
const utility = require('utility');

const MAX_SAFE_INTEGER = utility.MAX_SAFE_INTEGER;

let id = 0;
exports.newId = () => {
  id = id < MAX_SAFE_INTEGER ? id + 1 : 0;
  return id;
};

exports.handleLong = require('hessian.js/lib/utils').handleLong;

const primitiveMap = {
  void: 'V',
  boolean: 'Z',
  byte: 'B',
  char: 'C',
  double: 'D',
  float: 'F',
  int: 'I',
  long: 'J',
  short: 'S',
};
const isArray = c => c.startsWith('[');
const getComponentType = c => {
  if (isArray(c)) {
    return c.slice(1);
  }
  return c;
};
const getJavaClassDesc = val => {
  if (is.nullOrUndefined(val)) {
    return 'Ljava/lang/Object;';
  }
  const type = typeof val;
  switch (type) {
    case 'boolean':
      return primitiveMap.boolean;
    case 'string':
      return 'Ljava/lang/String;';
    case 'number':
      if (is.long(val)) {
        return primitiveMap.long;
      }
      if (is.int(val)) {
        return primitiveMap.int;
      }
      return primitiveMap.double;
    default:
      break;
  }
  if (is.date(val)) {
    return 'Ljava/util/Date;';
  }
  if (is.buffer(val)) {
    return `[${primitiveMap.byte}`;
  }
  if (is.array(val)) {
    return 'Ljava/util/ArrayList;';
  }
  if (is.error(val)) {
    return 'Ljava/lang/Exception;';
  }
  if (!utility.has(val, '$class')) {
    return 'Ljava/util/HashMap;';
  }
  let ret = '';
  let $class = val.$abstractClass || val.$class;
  while (isArray($class)) {
    ret += '[';
    $class = getComponentType($class);
  }
  if (primitiveMap[$class]) {
    ret += primitiveMap[$class];
  } else {
    ret += `L${$class.replace(/\./g, '/')};`;
  }
  return ret;
};

exports.getJavaArgsDesc = args => args.map(arg => getJavaClassDesc(arg)).join('');

exports.desc2classArray = desc => {
  if (!desc) {
    return [];
  }
  const arr = [];
  const len = desc.length;
  for (let i = 0; i < len; ++i) {
    let type = desc[i];
    let prefix = '';
    let javaType;
    if (type === '[') {
      prefix = '[';
      type = desc[++i];
    }
    switch (type) {
      case 'V':
        javaType = 'void';
        break;
      case 'Z':
        javaType = 'boolean';
        break;
      case 'B':
        javaType = 'byte';
        break;
      case 'C':
        javaType = 'char';
        break;
      case 'D':
        javaType = 'double';
        break;
      case 'F':
        javaType = 'float';
        break;
      case 'I':
        javaType = 'int';
        break;
      case 'J':
        javaType = 'long';
        break;
      case 'S':
        javaType = 'short';
        break;
      case 'L':
        {
          let clazz = '';
          while (i < len && desc[++i] !== ';') {
            clazz += desc[i];
          }
          javaType = clazz.replace(/\//g, '.');
          break;
        }
      default:
        throw new Error(`[double-remoting] unknown class type => ${type}`);
    }
    arr.push(`${prefix}${javaType}`);
  }
  return arr;
};
