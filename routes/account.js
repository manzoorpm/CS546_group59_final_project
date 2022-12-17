const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/:userId").get(async (req, res) => {
  return res.render("userProfile", {
    title: "User Profile",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.tag,
    name: req.session.name,
    hasErrors: false,
  });
});
router
  .route("/edit/:userId")
  .get(async (req, res) => {
    return res.render("editAccount", {
      title: "Edit User Profile",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.render("editAccount", {
      title: "Edit User Profile",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      hasErrors: false,
    });
  });
router
  .route("/remove/:userId")
  .get(async (req, res) => {
    return res.redirect("removeAccount", {
      title: "User Profile",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    return res.redirect("removeAccount", {
      title: "User Profile",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      hasErrors: false,
    });
  });

module.exports = router;
