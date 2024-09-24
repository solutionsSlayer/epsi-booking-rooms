'use strict';

/**
 * building router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/buildings',
      handler: 'building.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/buildings',
      handler: 'building.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/buildings/:id',
      handler: 'building.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/all-buildings',
      handler: 'building.findAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
