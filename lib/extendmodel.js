'use strict';

const _ = require('lodash');
const CustomError = require('./errors').CustomError;

module.exports = function(model, defAttr, filters) {
  if (defAttr && defAttr.length === 0)defAttr = undefined;
  filters = filters || [];
  // 记录所有需要过滤的字段，同时要避免同一个字段反复过滤
  const filterFields = {};
  for (const filter of filters) {
    for (const key of filter.list) {
      if (!filterFields[key]) {
        filterFields[key] = 1;
      } else {
        throw new CustomError(`Duplicate field filter:${key}(${model.getTableName()})`);
      }
    }
  }
  // 判断数据是否需要过滤
  const checkFilter = attr => {
    if (filters.length === 0 || !attr) return false;
    for (const key of attr) {
      if (filterFields[key]) return true;
    }
    return false;
  };
  // 数据对象复制函数
  const filterOne = source => {
    const obj = _.defaults({}, source);
    for (const filter of filters) {
      for (const key of filter.list) {
        if (obj[key]) {
          obj[key] = filter.filter(obj[key]);
        }
      }
    }
    return obj;
  };

  // 快速处理结果中的JSON
  const filterAll = function(obj) {
    if (!obj) return obj;
    if (_.isArray(obj)) {
      const len = obj.length;
      const result = new Array(len);
      for (let i = 0; i < len; i++) {
        result[i] = filterOne(obj[i]);
      }
      return result;
    }
    return filterOne(obj);
  };

  model.filterAll = filterAll;
  // 简化参数的findAll
  model.simpleFind = async function(where, attributes, t) {
    attributes = attributes || defAttr;
    const findJson = {
      attributes,
      where,
      transaction: t,
      raw: true,
    };
    const rows = await model.findAll(findJson);
    if (!checkFilter(attributes)) {
      return rows;
    }
    return filterAll(rows);
  };

  // 简化参数的findOne
  model.simpleFindOne = async function(where, attributes, t) {
    attributes = attributes || defAttr;
    const findJson = {
      attributes,
      where,
      transaction: t,
      raw: true,
    };
    const obj = await model.findOne(findJson);
    if (!obj || !checkFilter(attributes)) {
      return obj;
    }
    return filterOne(obj);
  };
  // 快速得到默认列
  model.defaultAttributes = defAttr;
};
