'use strict';

const _ = require('lodash');
const { FastFailError } = require('../../lib/errors');

module.exports = {
  setBody(code, msg, data) {
    return { code, msg, data };
  },
  success(data, msg) {
    if (!_.isUndefined(this.body)) {
      return this.logger.error('ctx.body不可重复设置');
    }
    this.body = this.setBody(this.app.errCode.SUCCESS, msg, data);
  },
  fail(msg, code, data) {
    if (_.isUndefined(code)) {
      if (_.isNumber(msg)) {
        this.body = this.setBody(msg, '服务器错误', code);
      } else if (_.isUndefined(msg)) {
        this.body = this.setBody(this.app.errCode.UNKNOWN, '服务器错误');
      } else {
        this.body = this.setBody(this.app.errCode.UNKNOWN, msg);
      }
    } else if (_.isNumber(code)) {
      this.body = this.setBody(code, msg, data);
    } else {
      this.body = this.setBody(this.app.errCode.UNKNOWN, msg, code);
    }
  },
  throwFail(msg, code, data) {
    throw new FastFailError(msg, code, data);
  },
};
