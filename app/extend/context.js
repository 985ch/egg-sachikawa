'use strict';

const _ = require('lodash');
const { FastFailError } = require('../../lib/errors');

function setBody(code, msg, data) {
  return { code, msg, data };
}

module.exports = {
  success(data, msg) {
    if (!_.isUndefined(this.body)) {
      return this.logger.error('ctx.body不可重复设置');
    }
    this.body = setBody(0, msg, data);
  },
  fail(msg, code, data) {
    if (_.isUndefined(code)) {
      if (_.isNumber(msg)) {
        this.body = setBody(msg, '服务器错误', code);
      } else if (_.isUndefined(msg)) {
        this.body = setBody(-1, '服务器错误');
      } else {
        this.body = setBody(-1, msg);
      }
    } else if (_.isNumber(code)) {
      this.body = { code, msg, data };
    } else {
      this.body = setBody(-1, msg, code);
    }
  },
  throwFail(msg, code, data) {
    throw new FastFailError(msg, code, data);
  },
};
