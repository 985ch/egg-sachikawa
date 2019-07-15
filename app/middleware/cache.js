'use strict';
const Stream = require('stream');
const _ = require('lodash');

module.exports = options => {
  const infoOpt = _.assign({}, options, { raw: false });
  const dataOpt = _.assign({}, options, { raw: true });
  return async (ctx, next) => {
    const cache = ctx.app.cache9.get(options.cache);
    const ctxKey = options.ctxKey(ctx);
    const acceptEncoding = ctx.acceptsEncodings('gzip', 'deflate', 'identity');
    const infoKey = 'i:' + acceptEncoding + ':' + ctxKey;

    // 尝试从缓存中获取数据并直接返回
    const dataInfo = await cache.getCache(infoKey, infoOpt);
    if (dataInfo) {
      const data = await cache.getCache(dataInfo.dataKey, dataOpt);
      if (data) {
        ctx.body = dataInfo.buffer ? Buffer.from(data, 'binary') : (dataInfo.isJson ? JSON.parse(data) : data);
        if (dataInfo.encoding) {
          ctx.set('Content-Type', dataInfo.contentType);
          ctx.set('Content-Encoding', dataInfo.encoding);
          ctx.res.removeHeader('Content-Length');
        }
        return;
      }
    }
    // 正常执行接口
    await next();

    const encoding = ctx.response.get('Content-Encoding');
    const contentType = ctx.response.get('content-type');
    const dataKey = 'd:' + encoding + ':' + ctxKey;

    // 根据执行结果将数据处理之后写入缓存
    if (ctx.body instanceof Stream) {
      const buffers = [];
      ctx.body.on('data', data => {
        buffers.push(data);
      });
      ctx.body.on('end', () => {
        const data = Buffer.concat(buffers).toString('binary');
        cache.setCache(dataKey, data, dataOpt);
        if (encoding) {
          cache.setCache(infoKey, { dataKey, encoding, contentType, buffer: true }, infoOpt);
        } else {
          cache.setCache(infoKey, { dataKey, contentType, buffer: true }, infoOpt);
        }
      });
    } else if (_.isBuffer(ctx.body)) {
      cache.setCache(dataKey, ctx.body.toString('binary'), dataOpt);
      if (encoding) {
        cache.setCache(infoKey, { dataKey, encoding, contentType, buffer: true }, infoOpt);
      } else {
        cache.setCache(infoKey, { dataKey, contentType, buffer: true }, infoOpt);
      }
    } else {
      const isJson = _.isObject(ctx.body);
      const data = isJson ? JSON.stringify(ctx.body) : ctx.body;
      cache.setCache(dataKey, data, dataOpt);
      if (encoding) {
        cache.setCache(infoKey, { dataKey, contentType, isJson, encoding }, infoOpt);
      } else {
        cache.setCache(infoKey, { dataKey, contentType, isJson }, infoOpt);
      }
    }
  };
};
