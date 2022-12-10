const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const helper = require('../helpers');

module.exports = router