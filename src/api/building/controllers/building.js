'use strict';

/**
 * building controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::building.building', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    // Fetch the building record using the building service
    const building = await strapi.service('api::building.building').findOne(id);

    if (!building) {
      return ctx.notFound('Building not found');
    }

    ctx.send(building);
  },
  async findAll(ctx) {
    // Fetch all building records using the building service
    const buildings = await strapi.service('api::building.building').findAll();

    ctx.send(buildings);
  },
  async seed(ctx) {
    const buildings = await strapi.service('api::building.building').seed();
    ctx.send(buildings);
  },
  async deleteAllRooms(ctx) {
    try {
      const result = await strapi.service('api::building.building').deleteAllRooms();
      ctx.send(result);
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
}));
