'use strict';

const RouterFactory = require('egg-router-factory');

class MyFactory extends RouterFactory {
  // 根据配置把中间件添加到参数
  setMiddlewares(obj, args) {
    const middlewares = this.app.middlewares;
    if (obj.ip)args.push(middlewares.ipfilter(obj));
    if (obj.params)args.push(middlewares.params(obj));
    if (obj.cache && this.app.config.cache9) {
      args.push(middlewares.cache(obj.cache));
    }
    if (obj.compress) args.push(middlewares.compress(obj.compress, this.app.config.compress));
  }
}

module.exports = MyFactory;
