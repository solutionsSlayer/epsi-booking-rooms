'use strict';

/**
 * app-user router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/app-users',
      handler: 'app-user.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/app-users',
      handler: 'app-user.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
