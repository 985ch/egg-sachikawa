'use strict';
const _ = require('lodash');
const extendModel = require('./extendmodel');

module.exports = {
  extendModel,
  pJson(raw) {
    return raw ? JSON.parse(raw) : {};
  },
  pArray(raw) {
    return raw ? JSON.parse(raw) : [];
  },
  // 直接往子成员插入值
  pushToObj(obj, path, value) {
    const lst = _.get(obj, path, []);
    lst.push(value);
    _.set(obj, path, lst);
  },
};
