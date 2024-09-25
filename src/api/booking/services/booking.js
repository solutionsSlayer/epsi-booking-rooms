'use strict';

/**
 * booking service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::booking.booking', ({ strapi }) => ({
  async create(params) {
    const { data } = params;

    try {
      if (!data.room || !data.app_user || !data.startTime || !data.endTime) {
        throw new Error('Invalid booking data. Room, app_user, startTime, and endTime are required.');
      }

      console.log('Creating booking with data:', data);

      const booking = await super.create(params);

      console.log('Booking created:', booking);

      if (!booking || !booking.id) {
        throw new Error('Booking creation failed');
      }

      // Fetch the complete booking data including relations
      const completeBooking = await strapi.entityService.findOne('api::booking.booking', booking.id, {
        populate: ['room'],
      });

      if (!completeBooking || !completeBooking.room || !completeBooking.room.id) {
        throw new Error('Unable to fetch complete booking data');
      }

      await strapi.service('api::availability.availability').updateAvailabilityAfterBooking(
        completeBooking.room.id,
        new Date(completeBooking.startTime),
        new Date(completeBooking.endTime)
      );

      return completeBooking;
    } catch (error) {
      console.error('Error in booking service:', error);
      throw error;
    }
  },
  async getBookings() {
    try {
      const bookings = await strapi.entityService.findMany('api::booking.booking', {
        populate: ['room', 'app_user'],
      });
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('An error occurred while fetching bookings');
    }
  },
}));
