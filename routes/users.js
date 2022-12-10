// users routes
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const restaurantData = data.restaurants;
const reservationData = data.reservations;
const helper = require('../helpers');

router
.route("/")
.get(async (req, res) => {
    //code here for GET
    // USER DASHBOARD
    // check for userId in session
    console.log(req.session.userId)
    let userId = req.session.userId;
    let restaurantList = await restaurantData.getAllRestaurants()

    return res.render('userDashboard',{title:"User Dashboard",restaurants:restaurantList,userId:userId})
})


router
.route("/profile/:userId")
.get(async (req, res) => {
    //code here for GET
    // USER PROFILE PAGE
    let userId =req.params.userId
    let user = await userData.getUserById(userId);

    return res.render('userProfile',{title:"Profile Page",user:user})
})

router
.route("/profile/edit/:userId")
.get(async (req, res) => {
    //code here for GET
    //USER EDIT PROFILE FORM
    let user
    let userId = req.params.userId;
    user = await userData.getUserById(userId);
    console.log(user)
    return res.render('editUserProfile',{title:"Edit Profile Page",user:user})
})
.post(async (req, res) => {
    //code here for POST
    // POSTS DATA FROM EDIT PROFILE FORM AND RENDERS USER PROFILE PAGE OR ELSE RENDERS FORM AGAIN(UPDATE USER DATA FUNCTION)

})

router
.route("/reservation/:reservationId")
.get(async (req, res) => {
    //code here for GET
    // USER RESERVATION PAGE TO VIEW RESERVATION
    let reservationId = req.params.reservationId
    let userId =req.session.userId
    let user = await userData.getUserById(userId);
    let reservation = await reservationData.getReservationById(reservationId)

    return res.render('userProfile',{title:"Profile Page",reservation:reservation})
})


router
.route("/restaurant/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // USER RESTAURANT PAGE WITH LINKS TO MAKE RESERVATION AND WRITE REVIEW
    ;
    let restaurantId = req.params.restaurantId
    let restaurant = await restaurantData.getRestaurantById(restaurantId)

    return res.render('userRestaurant',{title:"Restaurant Page",restaurant:restaurant,userId:req.session.userId})
})

router
.route("/restaurant/addReservation/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // USER RESTAURANT RESERVATION FORM
})
.post(async (req, res) => {
    //code here for POST
    // POSTS DATA FROM ADD RESERVATION AND RENDERS RESERVATION PAGE OR ELSE RENDERS RESERVATION FORM AGAIN 
})

router
.route("/restaurant/addReview/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // USER RESTAURANT REVIEW FORM
})
.post(async (req, res) => {
    //code here for POST
    // POSTS DATA FROM ADD REVIEW AND RENDERS RESTAURANT PAGE PAGE OR ELSE RENDERS REVIEW FORM AGAIN 
})


module.exports = router