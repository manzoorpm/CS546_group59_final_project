// restaurants data functions
const mongoCollections = require("../config/mongoCollections");
const restaurants = mongoCollections.restaurants;

async function createRestaurant(){}

async function getAllRestaurants(){}

async function getRestaurantById(){}

async function removeRestaurant(){}

async function updateRestaurant(){}

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    removeRestaurant,
    updateRestaurant
}