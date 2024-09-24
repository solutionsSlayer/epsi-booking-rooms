'use strict';

/**
 * translation router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/bookings',
      handler: 'translation.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/bookings',
      handler: 'translation.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
