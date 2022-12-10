const express = require("express");
const router = express.Router();
const data = require("../data");
const eestaurantData = data.restaurants;

router.get("/", async (req, res) => {
  res.render("restaurants/home", { users: "users" });
});

module.exports = router;

