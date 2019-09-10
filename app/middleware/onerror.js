'use strict';

const _ = require('lodash');

module.exports = options => {
  let errFunc;
  if (process.env.NODE_ENV === 'production') {
    errFunc = (e, ctx) => (ctx.fail(options.errText || '服务器发生未知错误'));
  } else {
    errFunc = (e, ctx) => { ctx.fail(e.stack); };
  }
  return async (ctx, next) => {
    try {
      await next();
      if (_.isUndefined(ctx.body)) {
        ctx.fail('没有正确的返回', ctx.app.errCode.UNDEFINED_BODY);
      }
    } catch (e) {
      switch (e.name) {
        case 'AjvParserError':
          ctx.fail('参数校验失败', ctx.app.errCode.INVAILD_PARAM, e.data);
          break;
        case 'ForbiddenError':
          ctx.status = 403;
          ctx.body = e.message;
          break;
        case 'FastFailError':
          {
            const { msg, code, data } = e.data;
            ctx.fail(msg, code, data);
          }
          break;
        default: // 其他未捕获错误
          ctx.logger.error(e);
          errFunc(e, ctx);
          break;
      }
    }
  };
};
