'use strict';

module.exports = {
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  routerFactory: {
    enable: true,
    package: 'egg-router-factory',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  cache9: {
    enable: true,
    package: 'egg-cache-9',
  },
  redlock9: {
    enable: true,
    package: 'egg-redlock-9',
  },
  rpcLike: {
    enable: true,
    package: 'egg-rpc-like',
  },
};
