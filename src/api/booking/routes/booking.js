'use strict';

/**
 * booking router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/bookings',
      handler: 'booking.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/bookings',
      handler: 'booking.getBookings',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
