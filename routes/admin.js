const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/").get(async (req, res) => {
  return res.render("adminDashboard", {
    title: "Admin Dashboard",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.tag,
    name: req.session.name,
    hasErrors: false,
  });
});
router
  .route("restaurant/add")
  .get(async (req, res) => {})
  .post(async (req, res) => {});
router
  .route("restaurant/delete/:restaurantId")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

module.exports = router;
