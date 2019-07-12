'use strict';
const Stream = require('stream');
// const Buffer = require('buffer');

module.exports = options => {
  return async (ctx, next) => {
    const cache = ctx.app.cache9.get(options.cache);
    const ctxKey = options.ctxKey(ctx);
    const acceptEncoding = ctx.request.get('Accept-Encoding');
    const infoKey = 'i:' + acceptEncoding + ':' + ctxKey;
    const dataInfo = await cache.getCache(infoKey, options);
    if (dataInfo) {
      const data = await cache.getCache(dataInfo.dataKey, options);
      if (data) {
        if (dataInfo.buffer) {
          console.log(data);
          const b = Buffer.from(data, 'binary');
          console.log(b.toString('base64'));
        }
        ctx.body = dataInfo.buffer ? Buffer.from(data, 'binary') : data;
        if (dataInfo.encoding) {
          ctx.set('Content-Encoding', dataInfo.encoding);
          ctx.res.removeHeader('Content-Length');
        }
        return;
      }
    }
    await next();
    const encoding = ctx.response.get('Content-Encoding');

    const dataKey = 'd:' + encoding + ':' + ctxKey;
    if (ctx.body instanceof Stream) {
      let result = '';
      let b = '';
      ctx.body.on('data', data => {
        result += data.toString('binary');
        b += data.toString('base64');
        console.log(result);
        console.log(b);
      });
      ctx.body.on('end', () => {
        cache.setCache(dataKey, result);
        if (encoding) {
          cache.setCache(infoKey, { dataKey, encoding, buffer: true });
        } else {
          cache.setCache(infoKey, { dataKey, buffer: true });
        }
      });
    } else {
      cache.setCache(dataKey, ctx.body);
      if (encoding) {
        cache.setCache(infoKey, { dataKey, encoding });
      } else {
        cache.setCache(infoKey, { dataKey });
      }
    }
  };
};

