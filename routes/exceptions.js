const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/forbidden").get(async (req, res) => {
  return res.status(403).render("forbiddenAccess", {
    error: "no accesss",
  });
});

module.exports = router;