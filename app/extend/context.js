'use strict';

const _ = require('lodash');

module.exports = {
  success(msg, data) {
    if (_.isUndefined(data)) {
      this.body = {
        code: 0,
        data: msg,
      };
    } else {
      this.body = {
        code: 0,
        msg,
        data,
      };
    }
  },
  fail(code, msg, data) {
    if (_.isUndefined(msg)) {
      if (_.isString(code)) {
        this.body = {
          code: -1,
          msg: code,
        };
        return;
      }
    }
    return { code, msg, data };
  },
};
