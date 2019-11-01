'use strict';

const process = require('process');
const _ = require('lodash');

const CustomError = require('./errors').CustomError;

const extendModel = require('./extendmodel');
const randString = require('./randString');

const isProd = process.env.EGG_SERVER_ENV === 'prod';

module.exports = {
  extendModel, // 数据模型扩展
  randString, // 随机字符串
  env, // 根据EGG_SERVER_ENV环境获取不同的环境变量，若环境变量未定义则抛出错误
  pJson, // 字符串转化为JSON
  pushToObj, // 直接往子成员插入值
};

// 将text字符串直接转化为JSON，value是转化失败时的默认值
function pJson(text, value) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return _.isUndefined(value) ? {} : value;
  }
}

// 直接往子成员插入值
function pushToObj(obj, path, value) {
  const lst = _.get(obj, path, []);
  lst.push(value);
  _.set(obj, path, lst);
}

// 根据EGG_SERVER_ENV环境获取不同的环境变量，若环境变量未定义则抛出错误
function env(prod, other) {
  if (other && _.isUndefined(process.env[other])) {
    if (!isProd) throw new CustomError(`Undefined env:${other}`);
  }
  if (_.isUndefined(process.env[prod])) {
    if (isProd || !other) throw new CustomError(`Undefined env:${prod}`);
  }
  return (isProd || !other) ? process.env[prod] : process.env[other];
}
