'use strict';

/**
 * room router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rooms/available',
      handler: 'room.getAvailableRooms',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
