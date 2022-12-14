const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/admin").get(async (req, res) => {
  return res.render("adminDashboard", {
    title: "Admin Dashboard",
    admin: req.session.admin,
    adminId: req.session.adminId,
    name: req.session.name,
    loggedIn: true,
    hasErrors: false,
  });
});
router
  .route("admin/restaurant/add")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

router.route("/restaurant").get(async (req, res) => {
  return res.render("restaurantDashboard", {
    title: "Restaurant Dashboard",
    restaurant: req.session.restaurant,
    restaurantId: req.session.restaurantId,
    name: req.session.name,
    loggedIn: true,
    hasErrors: false,
  });
});

module.exports = router;
