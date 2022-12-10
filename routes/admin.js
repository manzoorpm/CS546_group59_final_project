// admin routes
const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require('../helpers');

router
.route("/")
.get(async (req, res) => {
    //code here for GET
    // ADMIN DASHBOARD
});

router
.route("/profile/:userId")
.get(async (req, res) => {
    //code here for GET
    // ADMIN PROFILE PAGE
});

router
.route("/addR")
.get(async (req, res) => {
    //code here for GET
    // ADMIN ADD RESTAURANT FORM
})
.post(async (req, res) => {
    // POSTS DATA FROM ADD RESTAURANT FORM AND RENDERS DASHBOARD IF SUCCESSFUL OR ELSE RENDERS THE FORM AGAIN(CREATE RESTAURANT IN DATA FUNCTION)
})

router
.route("/restaurant/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // ADMIN RESTAURANT PAGE WITH LINKS TO EDIT PAGE AND REMOVE CONFIRMATION PAGE
});

router
.route("/restaurant/edit/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // ADMIN EDIT RESTAURANT FORM
})
.post(async (req, res) => {
    // POSTS DATA FROM EDIT RESTAURANT FORM AND RENDERS ADMIN RESTAURANT PAGE IF SUCCESSFUL OR ELSE RENDERS THE FORM AGAIN(UPDATE RESTAURANT IN DATA FUNCTION)
})

router
.route("/restaurant/remove/:restaurantId")
.get(async (req, res) => {
    //code here for GET
    // ADMIN REMOVE RESTAURANT CONFIRMATION
})
.post(async (req, res) => {
    // POSTS DATA FROM RESTAURANT FORM AND RENDERS DASHBOARD IF SUCCESSFUL OR ELSE RENDERS THE RESTAURANT PAGE(REMOVE RESTAURANT IN DATA FUNCTION)
})



module.exports = router