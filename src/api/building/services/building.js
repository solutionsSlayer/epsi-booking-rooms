'use strict';

// const sampleData = require('config/seed');

module.exports = {
  async findOne(id) {
    try {
      const building = await strapi.entityService.findOne('api::building.building', id);
      return building;
    } catch (err) {
      throw new Error('Error fetching building');
    }
  },

  async findAll() {
    try {
      const buildings = await strapi.entityService.findMany('api::building.building');
      return buildings;
    } catch (err) {
      throw new Error('Error fetching buildings');
    }
  },

  async seed() {
    try {
      // Sample data
      const buildings = [
        { location: 'FAURE', name: 'Building A' },
        { location: 'BRUGES', name: 'Building B' },
      ];

      const rooms = [
        { availableSeats: 30, name: 'Room 101', roomType: 'LAB', buildingName: 'Building A' },
        { availableSeats: 50, name: 'Room 102', roomType: 'MEETING', buildingName: 'Building A' },
        { availableSeats: 40, name: 'Room 201', roomType: 'CLASSROOM', buildingName: 'Building B' },
        { availableSeats: 25, name: 'Room 202', roomType: 'LAB', buildingName: 'Building B' },
      ];

      const roles = [
        { name: 'TEACHER' },
      ];

      const users = [
        { name: 'John Doe', roleName: 'TEACHER' },
        { name: 'Jane Smith', roleName: 'TEACHER' },
      ];

      console.log('Creating buildings...');
      const createdBuildings = await Promise.all(
        buildings.map(data => strapi.entityService.create('api::building.building', { data }))
      );
      console.log('Buildings created:', createdBuildings);

      console.log('Creating rooms...');
      const createdRooms = await Promise.all(
        rooms.map(data => {
          const building = createdBuildings.find(b => b.name === data.buildingName);
          return strapi.entityService.create('api::room.room', {
            data: { ...data, building: building.id },
          });
        })
      );
      console.log('Rooms created:', createdRooms);

      console.log('Creating roles...');
      const createdRoles = await Promise.all(
        roles.map(data => strapi.entityService.create('api::app-role.app-role', { data }))
      );
      console.log('Roles created:', createdRoles);

      console.log('Creating users...');
      const createdUsers = await Promise.all(
        users.map(data => {
          const role = createdRoles.find(r => r.name === data.roleName);
          return strapi.entityService.create('api::app-user.app-user', {
            data: { ...data, app_role: role.id },
          });
        })
      );
      console.log('Users created:', createdUsers);

      console.log('Creating availabilities...');
      const startDate = new Date('2024-09-23T00:00:00');
      const endDate = new Date('2024-09-27T23:59:59');
      const availabilities = [];

      for (const room of createdRooms) {
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          for (let hour = 8; hour < 20; hour++) {
            availabilities.push({
              room: room.id,
              startTime: new Date(new Date(d).setHours(hour, 0, 0)),
              endTime: new Date(new Date(d).setHours(hour + 1, 0, 0)),
              isBooked: false,
            });
          }
        }
      }

      const createdAvailabilities = await Promise.all(
        availabilities.map(data => strapi.entityService.create('api::availability.availability', { data }))
      );
      console.log('Availabilities created:', createdAvailabilities.length);

      console.log('Creating bookings...');
      const bookings = [
        {
          room: createdRooms[0].id,
          app_user: createdUsers[0].id,
          name: 'Morning Lab',
          startTime: new Date('2024-09-23T09:00:00'),
          endTime: new Date('2024-09-23T12:00:00'),
        },
        {
          room: createdRooms[1].id,
          app_user: createdUsers[1].id,
          name: 'Afternoon Meeting',
          startTime: new Date('2024-09-24T14:00:00'),
          endTime: new Date('2024-09-24T16:00:00'),
        },
        {
          room: createdRooms[2].id,
          app_user: createdUsers[0].id,
          name: 'Full Day Workshop',
          startTime: new Date('2024-09-25T09:00:00'),
          endTime: new Date('2024-09-25T17:00:00'),
        },
        {
          room: createdRooms[3].id,
          app_user: createdUsers[1].id,
          name: 'Evening Session',
          startTime: new Date('2024-09-26T18:00:00'),
          endTime: new Date('2024-09-26T20:00:00'),
        },
      ];

      const createdBookings = await Promise.all(
        bookings.map(data => strapi.entityService.create('api::booking.booking', { data }))
      );
      console.log('Bookings created:', createdBookings);

      // Update availabilities based on bookings
      // for (const booking of createdBookings) {
      //   await strapi.service('api::availability.availability').updateAvailabilityAfterBooking(
      //     booking.room,
      //     new Date(booking.startTime),
      //     new Date(booking.endTime)
      //   );
      // }

      return {
        createdBuildings,
        createdRooms,
        createdRoles,
        createdUsers,
        createdAvailabilities,
        createdBookings,
      };
    } catch (err) {
      console.error('Error seeding data:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw new Error(`Error seeding data: ${err.message}`);
    }
  },

  async deleteAllRooms() {
    try {
      // Fetch all rooms
      const rooms = await strapi.entityService.findMany('api::room.room');

      // Delete each room
      for (const room of rooms) {
        await strapi.entityService.delete('api::room.room', room.id);
      }

      console.log('All rooms have been deleted');
      return { message: 'All rooms have been deleted successfully' };
    } catch (err) {
      console.error('Error deleting rooms:', err);
      throw new Error(`Error deleting rooms: ${err.message}`);
    }
  },
};