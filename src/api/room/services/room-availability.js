'use strict';

module.exports = ({ strapi }) => ({
  async getAvailableRooms(campusId, startTime, endTime) {
    const rooms = await strapi.entityService.findMany('api::room.room', {
      filters: {
        building: {
          id: campusId,
        },
      },
      populate: ['availabilities'],
    });

    const availableRooms = rooms.filter(room => {
      const conflictingAvailability = room.availabilities.find(availability => {
        return (
          (startTime >= availability.startTime && startTime < availability.endTime) ||
          (endTime > availability.startTime && endTime <= availability.endTime) ||
          (startTime <= availability.startTime && endTime >= availability.endTime)
        );
      });
      return !conflictingAvailability;
    });

    return availableRooms;
  },
});
