'use strict';

const path = require('path');
const egg = require('egg');

const RouterFactory = require('../app/factory');
const Utils = require('./utils');
const Errors = require('./errors');

const EGG_PATH = Symbol.for('egg#eggPath');

class Application extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

module.exports = Object.assign(egg, {
  Application,
  Agent,
  RouterFactory,
  Utils,
  Errors,
});
