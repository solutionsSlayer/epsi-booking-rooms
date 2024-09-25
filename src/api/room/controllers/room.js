'use strict';

/**
 * room controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::room.room', ({ strapi }) => ({
  async getAvailableRooms(ctx) {
    const { campusId, startTime, endTime } = ctx.query;

    if (!campusId || !startTime || !endTime) {
      return ctx.badRequest('Missing required parameters');
    }

    const availableRooms = await strapi
      .service('api::room.room-availability')
      .getAvailableRooms(campusId, new Date(startTime), new Date(endTime));

    return availableRooms;
  },
}));
