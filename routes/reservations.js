// admin routes
const express = require("express");
const router = express.Router();
const data = require("../data");
const reservationData = data.reservations;
const userData = data.users;
const restaurantData = data.restaurants;
const helper = require("../helpers");
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || 'c75ae785fdda3b293f6568ad74e74928',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || '08b5bb40b44e5c9308ea2335c2462e74'
});


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
    const request = mailjet
        .post('send', {version: 'v3.1'})
        .request({
            Messages: [
                {
                    From: {
                        Email: "lim15@miamioh.edu",
                        Name: "BookPal Customer Service"
                    },
                    To: [
                        {
                            Email: user.emailId,
                            Name: user.firstName + " " + user.lastName
                        }
                    ],
                    Subject: "Your BookPal Reservation Confirmation for " + restaurant.name,
                    TextPart: "Dear " + user.firstName + " " + user.lastName + "! Bon Appétit! \n\n"
                        + "Reservation Confirmation for " + restaurant.name + "\n"
                        + "Reservation Id: " + reservationId + "\n"
                        + "Reservation Date: " + reservation.reservationDate + "\n"
                        + "Reservation Time: " + reservation.reservationTime + "\n"
                        + "Guests: " + reservation.people + "\n"
                        + "Address: " + restaurant.address + ", " + restaurant.city
                        + ", " + restaurant.state + ", " + restaurant.zip
                        + "\n\nIf you would like to cancel your reservation. Please call the restaurant at "
                        + restaurant.contactInfo
                }
            ]
        });
    request
        .then((result) => {
        })
        .catch((err) => {
        });


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


router.route("/delete/:reservationId").get(async (req, res) => {
});

module.exports = router;
