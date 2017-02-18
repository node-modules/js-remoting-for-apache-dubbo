'use strict';

class Result {
  constructor(options) {
    this.value = options || options.value;
    this.error = options || options.error;
  }
}

module.exports = Result;
