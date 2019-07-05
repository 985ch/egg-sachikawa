'use strict';

const process = require('process');

module.exports = options => {
  let errFunc;
  if (process.env !== 'production') {
    errFunc = (e, ctx) => (ctx.fail(options.errText || '服务器发生未知错误'));
  } else {
    errFunc = (e, ctx) => { ctx.fail(e.stack); };
  }
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      switch (e.name) {
        case 'AjvParserError':
          ctx.fail('参数校验失败', 100, e.data);
          break;
        case 'ForbiddenError':
          ctx.status = 403;
          ctx.body = e.message;
          break;
        default: // 其他未捕获错误
          ctx.logger.error(e);
          errFunc(e, ctx);
          break;
      }
    }
  };
};
