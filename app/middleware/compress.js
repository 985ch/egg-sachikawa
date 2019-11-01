'use strict';

const _ = require('lodash');
const compress = require('koa-compress');

module.exports = (options, config) => {
  const compressConfig = _.assign({ threshold: 4096 }, config || {});
  if (options === true) {
    options = compressConfig;
  } else {
    options = _.assign({}, compressConfig, options);
  }
  return compress(options);
};
