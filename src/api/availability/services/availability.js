'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

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
    console.log(`Updating availability for room ${roomId} from ${startTime} to ${endTime}`);

    const moment = require('moment');
    const start = moment(startTime);
    const end = moment(endTime);

    const availabilities = await strapi.db.query('api::availability.availability').findMany({
      where: {
        room: roomId,
        $or: [
          { startTime: { $lt: end.toDate() }, endTime: { $gt: start.toDate() } },
          { startTime: { $gte: start.toDate(), $lt: end.toDate() } },
          { endTime: { $gt: start.toDate(), $lte: end.toDate() } },
        ],
        isBooked: false,
      },
      populate: ['room'],
    });

    console.log(`Found ${availabilities.length} availabilities to update`);

    for (const availability of availabilities) {
      console.log(`Processing availability ${availability.id}: ${availability.startTime} - ${availability.endTime}`);
      const availStart = moment(availability.startTime);
      const availEnd = moment(availability.endTime);

      if (availStart.isBefore(start) && availEnd.isAfter(end)) {
        // Split the availability
        await strapi.entityService.create('api::availability.availability', {
          data: {
            room: roomId,
            startTime: availStart.toDate(),
            endTime: start.toDate(),
            isBooked: false,
          },
        });

        await strapi.entityService.create('api::availability.availability', {
          data: {
            room: roomId,
            startTime: end.toDate(),
            endTime: availEnd.toDate(),
            isBooked: false,
          },
        });

        await strapi.entityService.update('api::availability.availability', availability.id, {
          data: { 
            startTime: start.toDate(),
            endTime: end.toDate(),
            isBooked: true,
          },
        });
      } else if (availStart.isBefore(start)) {
        // Update the existing availability to end at the booking start time
        await strapi.entityService.update('api::availability.availability', availability.id, {
          data: { 
            endTime: start.toDate(),
          },
        });
      } else if (availEnd.isAfter(end)) {
        // Update the existing availability to start at the booking end time
        await strapi.entityService.update('api::availability.availability', availability.id, {
          data: { 
            startTime: end.toDate(),
          },
        });
      } else {
        // Mark the availability as booked
        await strapi.entityService.update('api::availability.availability', availability.id, {
          data: { isBooked: true },
        });
      }
    }

    console.log('Finished updating availabilities');
  },
}));
