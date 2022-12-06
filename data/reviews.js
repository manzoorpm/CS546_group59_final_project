const helper = require('../helpers');
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const restaurants = mongoCollections.restaurants;
const userData = require('./users');
const restaurantData = require('./restaurants');

// ReviewId will get initialized in the function
// ReviewDate will get initialized and set as current date
// ReviewerName will be taken from the name from the userId
async function createReview(userId,restaurantId,reviewTitle,review,rating){
    userId = helper.checkIsProperString(userId,"User ID");
    userId = helper.checkIsProperId(userId);
    let user = await userData.getUserById(userId);
    if(!user){
        throw `User doesn't exist`
    }

    restaurantId = helper.checkIsProperString(restaurantId,"Restaurant ID");
    restaurantId = helper.checkIsProperId(restaurantId);
    let restaurant = await restaurantData.getRestaurantById(restaurantId);
    if(!restaurant){
        throw `Restaurant doesn't exist`
    }

    reviewTitle = helper.checkIsProperString(reviewTitle,"Review Title");

    review = helper.checkIsProperString(review,"Review");

    rating = helper.checkIsProperString(rating,"Rating");
    rating = helper.validateNumber(rating,"Rating");
    rating = parseFloat(rating);
    if(rating<1 || rating>5){
        throw `Rating not between 1 and 5`
    }

    let datetime = new Date();
    let reviewDate = datetime.toDateString();

    let reviewerName = `${user.firstName} ${user.lastName}`;

    const newReview = {
        userId:ObjectId(userId),
        restaurantId:ObjectId(restaurantId),
        reviewTitle:reviewTitle,
        review:review,
        reviewDate:reviewDate,
        reviewerName:reviewerName,
        rating:rating
    }

    const reviewCollection = await reviews();
    const insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.insertedId || !insertInfo.acknowledged){
        throw [500,'Internal Server Error'];
    }
    else{
        // return {insertedReservation:true}
        const newId = insertInfo.insertedId.toString();
        let reviews1 = user.reviews;
        reviews1.push(newId);
        const updatedUser = {
            reviews:reviews1
        }
        const userCollection = await users();
        const updatedInfo1 = await userCollection.updateOne(
            {_id: ObjectId(userId)},
            {$set: updatedUser}
          );
        if (updatedInfo1.modifiedCount === 0) {
            throw 'could not update user successfully';
        }
        
        let reviews2 = restaurant.reviews;
        reviews2.push(newId);

        let or = ((((restaurant.reviews.length-1)*restaurant.overallRating)+rating)/((restaurant.reviews.length)))
        
        const updatedRestaurant = {
            overallRating:or,
            reviews:reviews2
        }
        const restaurantCollection = await restaurants();
        const updatedInfo2 = await restaurantCollection.updateOne(
            {_id: ObjectId(restaurantId)},
            {$set: updatedRestaurant}
          );
        if (updatedInfo2.modifiedCount === 0) {
            throw 'could not update restaurant successfully';
        }

        const review = await reviewCollection.findOne({_id: ObjectId(newId)});
        review._id = newId
        return review; 
    }
}

async function getAllUserReviews(userId){
    userId = helper.checkIsProperString(userId,"User ID");
    userId = helper.checkIsProperId(userId);
    let user = await userData.getUserById(userId);
    if(!user){
        throw `User doesn't exist`
    }
    const reviewCollection = await reviews();
    const reviewList = await reviewCollection.find({userId:ObjectId(userId)}).toArray();
    if(!reviewList){
        throw `No Reviews by the user`
    }
    for(let i=0;i<reviewList.length;i++){
        reviewList[i]._id = reviewList[i]._id.toString();
        reviewList[i].userId = reviewList[i].userId.toString();
        reviewList[i].restaurantId = reviewList[i].restaurantId.toString();
    }
    return reviewList
}

async function getAllRestaurantReviews(restaurantId){
    restaurantId = helper.checkIsProperString(restaurantId,"Restaurant Id");
    restaurantId = helper.checkIsProperId(restaurantId);
    let restaurant = await restaurantData.getRestaurantById(restaurantId);
    if(!restaurant){
        throw `Restaurant doesn't exist`
    }
    const reviewCollection = await reviews();
    const reviewList = await reviewCollection.find({restaurantId:ObjectId(restaurantId)}).toArray();
    if(!reviewList){
        throw `No Review for the restaurant`
    }
    for(let i=0;i<reviewList.length;i++){
        reviewList[i]._id = reviewList[i]._id.toString();
        reviewList[i].userId = reviewList[i].userId.toString();
        reviewList[i].restaurantId = reviewList[i].restaurantId.toString();
    }
    return reviewList
}

async function getReviewById(reviewId){
    if(arguments.length>1){
        throw [400,`More Parameters Passed`]
    }
    reviewId = helper.checkIsProperString(reviewId,"Review ID");
    reviewId = helper.checkIsProperId(reviewId);
    const reviewCollection = await reviews();
    let review = await reviewCollection.findOne({_id: ObjectId(reviewId)});
    if(!review || review === null){
        throw [404,`No user corresponds to the ID`]
    }
    review._id = review._id.toString()
    return review;
}

async function removeReview(reviewId){
    if(arguments.length>1){
        throw [400,`More Parameters Passed`]
    }
    reviewId = helper.checkIsProperString(reviewId,"Review ID");
    reviewId = helper.checkIsProperId(reviewId);
    const reviewCollection = await reviews();
    const review = await getReviewById(reviewId);
    let rating = review.rating;
    
    const deletionInfo = await reviewCollection.deleteOne({_id: ObjectId(reviewId)});

    if (deletionInfo.deletedCount === 0) {
        throw [500,`Could not delete review with id: ${reviewId}`];
    }
    let statement = {
    "reviewId":reviewId,
    "deleted": true
    }
    
    let userId = review.userId.toString();
    let user = await userData.getUserById(userId);
    let reviews1 = [];
    for(let i=0;i<user.reviews.length;i++){
        if(user.reviews[i]!==reviewId){
            reviews1.push(user.reviews[i]);
        }
    }
    const updatedUser = {
        reviews:reviews1
    }
    const userCollection = await users();
    const updatedInfo1 = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updatedUser}
      );
    if (updatedInfo1.modifiedCount === 0) {
        throw 'could not update user successfully';
    }
    
    let restaurantId = review.restaurantId.toString();
    let restaurant = await restaurantData.getRestaurantById(restaurantId);
    let reviews2 = [];
    let or;
    for(let i=0;i<restaurant.reviews.length;i++){
        if(restaurant.reviews[i]!==reviewId){
            reviews2.push(restaurant.reviews[i]);
        }
    }
    if(reviews2.length===0){
        or = 0
    }
    else{
        or = ((((reviews2.length+1)*restaurant.overallRating)-rating)/((reviews2.length)))
    }
    const updatedRestaurant = {
        overallRating:or,
        reviews:reviews2
    }
    const restaurantCollection = await restaurants();
    const updatedInfo2 = await restaurantCollection.updateOne(
        {_id: ObjectId(restaurantId)},
        {$set: updatedRestaurant}
      );
    if (updatedInfo2.modifiedCount === 0) {
        throw 'could not update restaurant successfully';
    }


    return statement;
}

// async function updateReview(){}

module.exports = {
    createReview,
    getAllUserReviews,
    getAllRestaurantReviews,
    getReviewById,
    removeReview
    // updateReview
}