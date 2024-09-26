'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const moment = require('moment-timezone');

module.exports = createCoreService('api::availability.availability', ({ strapi }) => ({
  async getAvailabilities(startDate, endDate) {
    const availabilities = await strapi.entityService.findMany('api::availability.availability', {
      filters: {
        startTime: { $lte: endDate },
        endTime: { $gte: startDate },
        isBooked: false,
      },
      populate: ['room'],
    });

    return availabilities;
  },

  async updateAvailabilityAfterBooking(roomId, startTime, endTime) {
    const utcStartTime = moment(startTime).utc();
    const utcEndTime = moment(endTime).utc();

    console.log(`Updating availability for room ${roomId} from ${utcStartTime.format()} to ${utcEndTime.format()}`);

    const availability = await strapi.db.query('api::availability.availability').findOne({
      where: {
        room: roomId,
        startTime: { $lte: utcEndTime.toDate() },
        endTime: { $gte: utcStartTime.toDate() },
        isBooked: false,
      },
    });

    console.log('Availability:', availability);

    if (availability) {
      const updatedAvailability = await strapi.entityService.update('api::availability.availability', availability.id, {
        data: { isBooked: true },
      });
      
      console.log(`Updated availability ${availability.id} to booked`);
      console.log('Updated availability:', updatedAvailability);
    } else {
      console.log('No matching availability found');
      throw new Error('No matching availability found');
    }
  },
}));
