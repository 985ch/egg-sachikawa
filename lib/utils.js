'use strict';
const _ = require('lodash');
const extendModel = require('./extendmodel');
const randString = require('./randString');

module.exports = {
  extendModel, // 数据模型扩展
  randString, // 随机字符串
  pJson(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : {};
  },
  pArray(raw) {
    return typeof raw === 'string' ? JSON.parse(raw) : [];
  },
  // 直接往子成员插入值
  pushToObj(obj, path, value) {
    const lst = _.get(obj, path, []);
    lst.push(value);
    _.set(obj, path, lst);
  },
};
