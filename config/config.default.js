'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_123456';

  return config;
};
