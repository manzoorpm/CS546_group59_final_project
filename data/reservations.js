const mongoCollections = require("../config/mongoCollections");
const reservations = mongoCollections.reservations;

async function createReservation(){}

async function getAllUserReservations(){}

async function getAllRestaurantReservations(){}

async function getReservationById(){}

async function removeReservation(){}

// async function updateReservation(){}

module.exports = {
    createReservation,
    getAllUserReservations,
    getAllRestaurantReservations,
    getReservationById,
    removeReservation
    // updateReservation
}