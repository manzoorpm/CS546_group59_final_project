const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/forbidden").get(async (req, res) => {
  return res.status(403).render("forbiddenAccess", {
    error: "no accesss",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.userTag,
    name: req.session.name,
  });
});

router.route("/notfound").get(async (req, res) => {
  return res.status(403).render("notFound", {
    error: "Not found",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.userTag,
    name: req.session.name,
  });
});
module.exports = router;
