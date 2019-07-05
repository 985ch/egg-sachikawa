'use strict';

const RouterFactory = require('egg-router-factory');

class MyFactory extends RouterFactory {
  // 根据配置把中间件添加到参数
  setMiddlewares(obj, args) {
    const app = this.app;
    if (obj.ip)args.push(app.middlewares.ipfilter(obj));
    if (obj.params)args.push(app.middlewares.params(obj));
  }
}

module.exports = MyFactory;
