'use strict';

exports.keys = '123456';

const define = {
  underscored: false,
  underscoredAll: false,
  timestamps: false, // 禁止自动添加更新时间字段
  freezeTableName: true, // 冻结表名，防止自动给表名添加s变成复数形式
};
exports.sequelize = {
  datasources: [
    {
      delegate: 'maindb', // load all models to app.model and ctx.model
      baseDir: 'model/main', // load models from `app/model/*.js`
      database: 'maindb',
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      define,
    },
  ],
};
