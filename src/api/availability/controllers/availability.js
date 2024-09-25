'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const moment = require('moment'); // Assuming moment.js is installed and required

module.exports = createCoreController('api::availability.availability', ({ strapi }) => ({
  async getAvailabilities(ctx) {
    const { startDate, endDate } = ctx.query;

    if (!startDate || !endDate) {
      return ctx.badRequest('Start date and end date are required');
    }

    try {
      const availabilities = await strapi.service('api::availability.availability').getAvailabilities(
        new Date(startDate),
        new Date(endDate)
      );

      return ctx.send(availabilities);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      return ctx.internalServerError('An error occurred while fetching availabilities');
    }
  },
}));