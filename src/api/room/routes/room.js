'use strict';

/**
 * room router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rooms',
      handler: 'room.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/rooms',
      handler: 'room.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
