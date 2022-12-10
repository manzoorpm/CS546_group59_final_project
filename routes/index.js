const restaurantRoutes = require('./restaurants');

const constructorMethod = (app) => {
  app.use('', restaurantRoutes);


  app.use('*', (req, res) => {
    res.redirect('/');
  });
};

module.exports = constructorMethod;
