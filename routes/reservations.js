const express = require("express");
const router = express.Router();
const data = require("../data");
const reservationData = data.reservations;
const userData = data.users;
const restaurantData = data.restaurants;

router.route("/:reservationId").get(async (req, res) => {
  try {
    let reservationId = req.params.reservationId;
    let reservation = await reservationData.getReservationById(reservationId);
    let restaurant = await restaurantData.getRestaurantById(
      reservation.restaurantId.toString()
    );

    return res.render("reservation", {
      title: "Reservation",
      reservationId: req.params.reservationId,
      reservation: reservation,
      restaurant: restaurant,
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.userTag,
      name: req.session.name,
    });
  } catch (e) {
    return res.render("error", {
      error: e,
    });
  }
});

router.route("/delete/:reservationId").get(async (req, res) => {});

module.exports = router;
