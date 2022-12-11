const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/user/:userId").get(async (req, res) => {
  return res.render("userProfile", {
    title: "User Profile",
    user: req.session.user,
    userId: req.session.userId,
    name: req.session.name,
    loggedIn: true,
    hasErrors: false,
  });
});
router.route("/admin/:adminId").get(async (req, res) => {
  return res.render("adminProfile", {
    title: "Admin Profile",
    admin: req.session.admin,
    adminId: req.session.adminId,
    name: req.session.name,
    loggedIn: true,
    hasErrors: false,
  });
});
router.route("/restaurant/:restaurantId").get(async (req, res) => {
  return res.render("restaurantProfile", {
    title: "Restaurant Profile",
    restaurant: req.session.restaurant,
    restaurantId: req.session.restaurantId,
    name: req.session.name,
    loggedIn: true,
    hasErrors: false,
  });
});
router
  .route("/user/edit/:userId")
  .get(async (req, res) => {
    return res.render("editUserProfile", {
      title: "Edit User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.render("editUserProfile", {
      title: "Edit User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });
router
  .route("/admin/edit/:adminId")
  .get(async (req, res) => {
    return res.render("editAdminProfile", {
      title: "Edit Admin Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.render("editAdminProfile", {
      title: "Edit Admin Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });
router
  .route("/restaurant/edit/:restaurantId")
  .get(async (req, res) => {
    return res.render("editRestaurantProfile", {
      title: "Edit Restaurant Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.render("editRestaurantProfile", {
      title: "Edit Restaurant Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });
router
  .route("/user/remove/:userId")
  .get(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });
router
  .route("/admin/remove/:adminId")
  .get(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });

router
  .route("/restaurant/remove/:restaurantId")
  .get(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.redirect("/", {
      title: "User Profile",
      restaurant: req.session.restaurant,
      restaurantId: req.session.restaurantId,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  });

module.exports = router;
