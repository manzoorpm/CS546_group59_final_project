// admin routes
const express = require("express");
const router = express.Router();
const data = require("../data");
const reservationData = data.reservations;
const userData = data.users;
const restaurantData = data.restaurants;

const helper = require("../helpers");

router.route("/:reservationId").get(async (req, res) => {
  //code here for GET
  // USER RESERVATION PAGE TO VIEW RESERVATION
  let reservationId = req.params.reservationId;
  let userId = req.session.userId;
  let user = await userData.getUserById(userId);
  let reservation = await reservationData.getReservationById(reservationId);
  let restaurant = await restaurantData.getRestaurantById(
    reservation.restaurantId.toString()
  );
  if (reservation.userId.toString() != userId) {
    res.redirect("/exceptions/forbidden");
  }

  return res.render("reservation", {
    title: "Reservation",
    reservationId: req.params.reservationId,
    reservation: reservation,
    restaurant: restaurant,
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.tag,
    name: req.session.name,
  });
});

router.route("/delete/:reservationId").get(async (req, res) => {});

module.exports = router;
