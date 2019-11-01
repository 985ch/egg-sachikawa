'use strict';

const _ = require('lodash');
const compress = require('koa-compress');

module.exports = options => {
  const compressConfig = _.assign({ threshold: 4096 }, this.app.config.compress || {});
  if (options === true) {
    options = compressConfig;
  } else {
    options = _.assign({}, compressConfig, options);
  }
  return compress(options);
};
