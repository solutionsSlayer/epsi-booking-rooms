'use strict';

/**
 * booking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  async create(ctx) {
    const { room, app_user, name, startTime, endTime } = ctx.request.body.data;

    try {
      const booking = await strapi.service('api::booking.booking').create({
        data: {
          room,
          app_user,
          name,
          startTime,
          endTime,
        },
      });

      return { data: booking };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },
  async getBookings(ctx) {
    try {
      const bookings = await strapi.service('api::booking.booking').getBookings();
      return { data: bookings };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },
}));
