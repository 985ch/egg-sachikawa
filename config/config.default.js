'use strict';

module.exports = appInfo => {
  const config = {};

  config.test = {
    key: appInfo.name + '_123456',
  };

  return config;
};
