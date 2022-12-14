const express = require("express");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const helper = require("../helpers");

router.route("/").get(async (req, res) => {
  let restaurantList = await restaurantData.getAllRestaurants();

  if (req.session.user) {
    return res.render("home", {
      title: "Explore Restaurants",
      user: req.session.user,
      userId: req.session.userId,
      name: req.session.name,
      restaurants: restaurantList,
      loggedIn: true,
      hasErrors: false,
    });
  }
  if (req.session.admin) {
    return res.render("home", {
      title: "Explore Restaurants",
      admin: req.session.admin,
      adminId: req.session.adminId,
      name: req.session.name,
      restaurants: restaurantList,
      loggedIn: true,
      hasErrors: false,
    });
  }
  if (req.session.restaurant) {
    return res.render("home", {
      title: "Explore Restaurants",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      restaurants: restaurantList,
      loggedIn: true,
      hasErrors: false,
    });
  }
  return res.render("home", {
    title: "Explore Restaurants",
    noUser: true,
    loggedIn: false,
    hasErrors: false,
    restaurants: restaurantList,
  });
});

router
  .route("/restaurant/:restaurantId")
  .get(async (req, res) => {
    //code here for GET
    let restaurantValues = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );

    if (req.session.user) {
      return res.render("restaurant", {
        title: restaurantValues.name,
        user: req.session.user,
        userId: req.session.userId,
        name: req.session.name,
        restaurantValues: restaurantValues,
        restaurantValueId: req.params.restaurantId,
        loggedIn: true,
        hasErrors: false,
      });
    }
    if (req.session.admin) {
      return res.render("restaurant", {
        title: restaurantValues.name,
        admin: req.session.admin,
        adminId: req.session.adminId,
        name: req.session.name,
        restaurantValues: restaurantValues,
        restaurantValueId: req.params.restaurantId,
        loggedIn: true,
        hasErrors: false,
      });
    }
    if (req.session.restaurant) {
      return res.render("restaurant", {
        title: restaurantValues.name,
        restaurant: req.session.restaurant,
        restaurantId: req.session.restaurantId,
        name: req.session.name,
        restaurantValues: restaurantValues,
        restaurantValueId: req.params.restaurantId,
        loggedIn: true,
        hasErrors: false,
      });
    }
    return res.render("restaurant", {
      title: restaurantValues.name,
      noUser: true,
      loggedIn: false,
      hasErrors: false,
      restaurantValues: restaurantValues,
      restaurantValueId: req.params.restaurantId,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    let restaurantValues = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    openingTime = restaurantValues.openingTime;
    closingTime = restaurantValues.closingTime;

    if (typeof restaurantValues.availability == "undefined") {
    }
    return res.render("restaurant", {
      title: restaurantValues.name,
      noUser: true,
      loggedIn: false,
      hasErrors: false,
      restaurantValues: restaurantValues,
      restaurantValueID: req.params.restaurantId,
      hasErrors: false,
    });
  });

router
  .route("/restaurant/:restaturantId/addreservation")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

module.exports = router;
