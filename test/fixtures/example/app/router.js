'use strict';

module.exports = app => {
  app.routerFactory.buildAllRouters(app.router);
};
