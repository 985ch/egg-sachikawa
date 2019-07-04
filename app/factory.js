'use strict';

const RouterFactory = require('egg-router-factory');

class MyFactory extends RouterFactory {
  // 根据配置把中间件添加到参数
  setMiddlewares(obj, args) {
    const app = this.app;
    for (const key in obj) {
      if (key === 'name' || key === 'path' || key === 'controller') continue;
      args.push(app.middlewares[key](obj[key]));
    }
  }
  // 根据路由数据生成文档
  buildDoc() {
    let text = '';
    for (let i = 0; i < this.routers.length; i++) {
      const obj = this.routers[i];
      text += `[${obj.method}]${obj.item.path || obj.path}\n`;
    }
    return text;
  }
}

module.exports = MyFactory;
