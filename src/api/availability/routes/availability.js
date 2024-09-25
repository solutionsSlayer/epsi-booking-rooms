module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/availabilities',
      handler: 'availability.getAvailabilities',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};