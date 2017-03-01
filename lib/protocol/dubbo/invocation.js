'use strict';

class Invocation {
  constructor(options) {
    options = options || {};
    this.methodName = options.methodName;
    this.args = options.args;
    this.attachments = options.attachments;
  }
}

module.exports = Invocation;
