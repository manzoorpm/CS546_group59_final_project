// admin routes
const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");

router.route("/:reservationId").get(async (req, res) => {
  //code here for GET
  // USER RESERVATION PAGE TO VIEW RESERVATION
  let reservationId = req.params.reservationId;
  let userId = req.session.userId;
  let user = await userData.getUserById(userId);
  let reservation = await reservationData.getReservationById(reservationId);

  return res.render("userProfile", {
    title: "Profile Page",
    reservation: reservation,
  });
});

router.route("/delete/:reservationId").get(async (req, res) => {});

module.exports = router;
