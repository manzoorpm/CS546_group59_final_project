// data index
const userData = require('./users');
const restaurantData = require('./restaurants');
const reservationData = require('./reservations')
const reviewData = require('./reviews')

module.exports = {
  users: userData,
  restaurants: restaurantData,
  reservations: reservationData,
  reviews: reviewData
};