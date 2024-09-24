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
        { availableSeats: 50, name: 'Room 102', roomType: 'MEETING', buildingName: 'Building B' },
      ];

      const roles = [
        { name: 'TEACHER' },
        { name: 'STUDENT' },
      ];

      const users = [
        { name: 'John Doe', roleName: 'TEACHER' },
        { name: 'Jane Smith', roleName: 'STUDENT' },
      ];

      const bookings = [
        { roomName: 'Room 101', userName: 'John Doe' },
        { roomName: 'Room 102', userName: 'Jane Smith' },
      ];

      // Create buildings
      const createdBuildings = await Promise.all(
        buildings.map(data => strapi.entityService.create('api::building.building', { data }))
      );

      // Create rooms
      const createdRooms = await Promise.all(
        rooms.map(data => {
          const building = createdBuildings.find(b => b.name === data.buildingName);
          return strapi.entityService.create('api::room.room', {
            data: { ...data, building: building.id },
          });
        })
      );

      // Create roles
      const createdRoles = await Promise.all(
        roles.map(data => strapi.entityService.create('api::app-role.app-role', { data }))
      );

      // Create users
      const createdUsers = await Promise.all(
        users.map(data => {
          const role = createdRoles.find(r => r.name === data.roleName);
          return strapi.entityService.create('api::app-user.app-user', {
            data: { ...data, app_roles: [role.id] },
          });
        })
      );

      // Create bookings
      await Promise.all(
        bookings.map(data => {
          const room = createdRooms.find(r => r.name === data.roomName);
          const user = createdUsers.find(u => u.name === data.userName);
          return strapi.entityService.create('api::translation.translation', {
            data: { room: room.id, app_user: user.id },
          });
        })
      );

      return { createdBuildings, createdRooms, createdRoles, createdUsers };
    } catch (err) {
      throw new Error('Error seeding data');
    }
  },
};