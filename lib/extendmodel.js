'use strict';

const _ = require('lodash');

module.exports = function(model, defaultAttributes, needParse) {
  needParse = needParse || [];
  // 数据对象复制函数
  const clone = source => {
    const obj = _.defaults({}, source);
    for (const key of needParse) {
      if (obj[key]) {
        obj[key] = JSON.parse(obj[key]);
      }
    }
    return obj;
  };

  // 快速处理结果中的JSON
  const parseAll = function(obj) {
    if (!obj) return obj;
    if (_.isArray(obj)) {
      const len = obj.length;
      const result = new Array(len);
      for (let i = 0; i < len; i++) {
        result[i] = clone(obj[i]);
      }
      return result;
    }
    return clone(obj);
  };

  model.parseAll = parseAll;
  // 简化参数的findAll
  model.simpleFind = async function(where, attributes, t) {
    attributes = attributes || defaultAttributes;
    const findJson = {
      attributes,
      where,
      transaction: t,
      raw: true,
    };
    const rows = await model.findAll(findJson);
    if (needParse.length === 0) {
      return rows;
    }
    return parseAll(rows);
  };

  // 简化参数的findOne
  model.simpleFindOne = async function(where, attributes, t) {
    attributes = attributes || defaultAttributes;
    const findJson = {
      attributes,
      where,
      transaction: t,
      raw: true,
    };
    const obj = await model.findOne(findJson);
    if (!obj || needParse.length === 0) {
      return obj;
    }
    return clone(obj);
  };
  // 快速得到默认列
  model.defaultAttributes = defaultAttributes;
};
