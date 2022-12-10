// index routes
const optionRoutes = require('./options')
const adminRoutes = require('./admin')
const userRoutes = require('./users');
const restaurantClientsRoutes = require('./restaurantClients');

// when the route is /movies use the routes defined in movies.js routing file, when the route is /reviews use the routes defined in reviews.js routing file, all other enpoints should return a 404 as shown in the lecture code.
const constructorMethod = (app) => {
    app.use('/', optionRoutes);
    app.use('/admin', adminRoutes);
    app.use('/user', userRoutes);
    app.use('/restaurantClient', restaurantClientsRoutes);

    app.use('*', (req, res) => {
      res.status(404).render('notFound');
    });
  };
  
  module.exports = constructorMethod;