'use strict';

const idToSerializations = {
  2: require('./hessian'),
};
const nameToSerializations = {
  hessian2: require('./hessian'),
};

exports.getSerializationById = id => {
  return idToSerializations[id];
};

exports.getSerializationByName = name => {
  return nameToSerializations[name];
};
