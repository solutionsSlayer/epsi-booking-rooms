'use strict';

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
};