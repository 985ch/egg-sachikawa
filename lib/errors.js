'use strict';

// 自定义错误
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 快速返回错误
class FastFailError extends CustomError {
  constructor(msg, code, data) {
    super(code + ':' + msg);
    this.data = { msg, code, data };
  }
}

module.exports = {
  CustomError,
  FastFailError,
};
