'use strict';

const _ = require('lodash');
const RouterFactory = require('egg-router-factory');

class MyFactory extends RouterFactory {
  // 根据配置把中间件添加到参数
  setMiddlewares(obj, args) {
    const middlewares = this.app.middlewares;
    if (obj.ip)args.push(middlewares.ipfilter(obj));
    if (obj.params)args.push(middlewares.params(obj));
    if (obj.cache) {
      const cacheConfig = _.assign({
        cache: 'http',
        ctxKey: ctx => ctx.path,
        ttl: 300,
      }, this.app.config.apiCache || {});
      args.push(middlewares.cache(cacheConfig));
    }
    if (obj.compress && this.app.config.cache9) {
      const compressConfig = _.assign({ threshold: 4096 }, this.app.config.compress || {});
      if (obj.compress === true) {
        obj.compress = compressConfig;
      } else {
        obj.compress = _.assign({}, compressConfig, obj.compress);
      }
      args.push(middlewares.compress(obj.compress));
    }
  }
}

module.exports = MyFactory;
