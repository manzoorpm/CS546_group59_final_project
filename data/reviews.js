const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;

async function createReview(){}

async function getAllUserReviews(){}

async function getAllRestaurantReviews(){}

async function getReviewById(){}

async function removeReview(){}

// async function updateReview(){}

module.exports = {
    createReview,
    getAllUserReviews,
    getAllRestaurantReviews,
    getReviewById,
    removeReview
    // updateReview
}