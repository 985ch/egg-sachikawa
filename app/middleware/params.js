'use strict';

const ajvParser = require('koa-ajv-parser');

module.exports = options => ajvParser(options);
