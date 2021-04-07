'use strict';

const _ = require('lodash');
const CustomError = require('./errors').CustomError;

module.exports = function(model, defAttr, filters) {
  if (!defAttr || defAttr.length === 0) {
    defAttr = _.keys(model.tableAttributes);
  }
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
  model.filterAll = obj => filterAll(obj, filters);
  // 简化参数的findAll
  model.simpleFind = async function(where, attributes, t) {
    attributes = attributes || defAttr;
    const findJson = { attributes, where, transaction: t, raw: true };
    const rows = await model.findAll(findJson);
    if (!checkFilter(attributes, filters, filterFields)) {
      return rows;
    }
    return filterAll(rows, filters);
  };

  // 简化参数的findOne
  model.simpleFindOne = async function(where, attributes, t) {
    attributes = attributes || defAttr;
    const findJson = { attributes, where, transaction: t, raw: true };
    const obj = await model.findOne(findJson);
    if (!obj || !checkFilter(attributes, filters, filterFields)) {
      return obj;
    }
    return filterOne(obj, filters);
  };
  // 快速得到默认列
  model.defaultAttributes = defAttr;
  // 扩展子查询功能，该功能用于生成一个子查询语句
  mountSubQuery(model);
};

// 判断数据是否需要过滤
function checkFilter(attr, filters, filterFields) {
  if (filters.length === 0 || !attr) return false;
  for (const key of attr) {
    if (filterFields[key]) return true;
  }
  return false;
}
// 数据对象复制函数
function filterOne(source, filters) {
  const obj = _.defaults({}, source);
  for (const filter of filters) {
    for (const key of filter.list) {
      if (!_.isUndefined(obj[key])) {
        obj[key] = filter.filter(obj[key]);
      }
    }
  }
  return obj;
}

// 快速处理结果中的JSON
function filterAll(obj, filters) {
  if (!obj) return obj;
  if (_.isArray(obj)) {
    const len = obj.length;
    const result = new Array(len);
    for (let i = 0; i < len; i++) {
      result[i] = filterOne(obj[i], filters);
    }
    return result;
  }
  return filterOne(obj, filters);
}

// 给模型挂载子查询功能
function mountSubQuery(model) {
  model.subQuery = function(findJson) {
    const { prefix } = findJson;
    const sequelize = model.sequelize.Sequelize;
    const tempSQL = model.sequelize.dialect.QueryGenerator.selectQuery(model.tableName, findJson).slice(0, -1); // to remove the ';' from the end of the SQL
    return sequelize.literal(`${_.isUndefined(prefix) ? '' : prefix} (${tempSQL})`);
  };
}
