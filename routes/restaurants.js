const express = require("express");
const { reservations } = require("../data");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const reservationsData = data.reservations;
const userData = data.users;
const reviewsData = data.reviews;
const helper = require("../helpers");
const xss = require("xss");
const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "c75ae785fdda3b293f6568ad74e74928",
  apiSecret:
    process.env.MJ_APIKEY_PRIVATE || "08b5bb40b44e5c9308ea2335c2462e74",
});

function sendMail(user, restaurant, reservation) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "lim15@miamioh.edu",
          Name: "BookPal Customer Service",
        },
        To: [
          {
            Email: user.emailId,
            Name: user.firstName + " " + user.lastName,
          },
          {
            Email: restaurant.emailId,
            Name: restaurant.name,
          },
        ],
        Subject: "Your BookPal Reservation Confirmation for " + restaurant.name,
        TextPart:
          "Dear " +
          user.firstName +
          " " +
          user.lastName +
          "! Bon Appétit! \n\n" +
          "Reservation Confirmation for " +
          restaurant.name +
          "\n" +
          "Reservation Id: " +
          reservation._id.toString() +
          "\n" +
          "Reservation Date: " +
          reservation.reservationDate +
          "\n" +
          "Reservation Time: " +
          reservation.reservationTime +
          "\n" +
          "Guests: " +
          reservation.people +
          "\n" +
          "Address: " +
          restaurant.address +
          ", " +
          restaurant.city +
          ", " +
          restaurant.state +
          ", " +
          restaurant.zip +
          "\n\nIf you would like to cancel your reservation. Please call the restaurant at " +
          restaurant.contactInfo,
      },
    ],
  });
  request.then((result) => {}).catch((err) => {});
}

router.route("/").get(async (req, res) => {
  try {
    let restaurants = await restaurantData.getAllRestaurants();

    return res.render("home", {
      title: "Explore Restaurants",
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.userTag,
      name: req.session.name,
      restaurantId: req.params.restaurantId,
      restaurants: restaurants,
      hasErrors: false,
    });
  } catch (e) {
    return res.render("error", {
      error: e,
    });
  }
});

router
  .route("/restaurant/:restaurantId")
  .get(async (req, res) => {
    try {
      let restaurant = await restaurantData.getRestaurantById(
        req.params.restaurantId
      );
      let restaurantCapacity = helper.getRestaurantCapacity(restaurant);
      availabilityAll = helper.getTimeSlots(
        restaurant.openingTime,
        restaurant.closingTime
      );
      let reviews = await reviewsData.getAllRestaurantReviews(
        req.params.restaurantId
      );
      return res.render("restaurant", {
        title: restaurant.name,
        user: req.session.user,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        restaurant: restaurant,
        restaurantId: req.params.restaurantId,
        availabilityAll: availabilityAll,
        restaurantCapacity: restaurantCapacity,
        review: reviews,
        hasErrors: false,
      });
    } catch (e) {
      return res.render("error", {
        error: e,
      });
    }
  })
  .post(async (req, res) => {
    try {
      let restaurant = await restaurantData.getRestaurantById(
        req.params.restaurantId
      );
      req.body.date = helper.checkBookingDate(req.body.date);
      req.body.guests = helper.checkGuests(req.body.guests);
      req.body.time = helper.checkInputTime(
        req.body.time,
        req.body.date,
        restaurant.closingTime
      );

      if (req.body.guests > helper.getRestaurantCapacity(restaurant))
        throw "The restaurant cannot accomodate entered number of guests";
      let restaurantCapacity = helper.getRestaurantCapacity(restaurant);
      let flag = 0;
      let allTime = helper.getAllTime(req.body.time);

      if (!helper.isEmptyObject(restaurant.availibility)) {
        var multipleAvailabilityArray = [];
        let temp;
        if (restaurant.availibility[req.body.date]) {
          temp = restaurant.availibility[req.body.date];
          for (let j = 0; j < allTime.length; j++) {
            if (temp[allTime[j]]) {
              multipleAvailabilityArray.push(temp[allTime[j]]);
              flag = 1;
            }
          }
        }
        if (flag) {
          let temp;
          tableCombinationSlotsArray = [];
          for (let i = 0; i < multipleAvailabilityArray.length; i++) {
            temp = helper.getTableCombinationSlots(
              multipleAvailabilityArray[i],
              req.body.guests
            );
            tableCombinationSlotsArray.push(temp);
          }

          tableCombinationSlots = tableCombinationSlotsArray.reduce((a, b) =>
            a.filter((c) => b.includes(c))
          );
        }
        if (!flag) {
          tableCombinationSlots = helper.getTableCombinationSlots(
            restaurant.restaurantTableCapacities,
            req.body.guests
          );
        }
      } else {
        tableCombinationSlots = helper.getTableCombinationSlots(
          restaurant.restaurantTableCapacities,
          req.body.guests
        );
      }

      return res.render("restaurant", {
        title: restaurant.name,
        user: req.session.user,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        tableCombinationSlots: tableCombinationSlots,
        time: req.body.time,
        date: req.body.date,
        guests: req.body.guests,
        restaurant: restaurant,
        restaurantId: req.params.restaurantId,
        restaurantCapacity: restaurantCapacity,
        hasErrors: false,
      });
    } catch (e) {
      if (e.name == "noSeats") {
        return res.render("error", {
          error: e.message,
          noSlotsError: true,
          restaurantId: req.params.restaurantId,
        });
      } else
        return res.render("error", {
          error: e,
          capacityError: true,
          restaurantId: req.params.restaurantId,
        });
    }
  });

router
  .route("/restaurant/:restaurantId/addreservation")
  .post(async (req, res) => {
    try {
      if (req.body.reservation) {
        res.redirect("/");
      }
      var temp;
      let flag = 0;
      let reservation;
      let restaurant = await restaurantData.getRestaurantById(
        req.params.restaurantId
      );
      let user = await userData.getUserById(req.session.userId);

      let allTime = helper.getAllTime(req.body.time);

      chosenCombinationArray = req.body.chosenCombination.split(" and ");

      if (!helper.isEmptyObject(restaurant.availibility)) {
        let currentCapacity = [];
        for (let i = 0; i < 4; i++) {
          currentCapacity.push(
            JSON.parse(JSON.stringify(restaurant.restaurantTableCapacities))
          );
        }

        for (let j = 0; j < currentCapacity.length; j++) {
          for (let i = 0; i < chosenCombinationArray.length; i++) {
            if (currentCapacity[j][parseInt(chosenCombinationArray[i])] != 0) {
              currentCapacity[j][parseInt(chosenCombinationArray[i])] =
                currentCapacity[j][parseInt(chosenCombinationArray[i])] - 1;
            }
          }
        }
        console.log(currentCapacity);

        if (restaurant.availibility[req.body.date]) {
          temp = restaurant.availibility[req.body.date];
          for (let j = 0; j < allTime.length; j++) {
            if (temp[allTime[j]]) {
              for (let k = 0; k < chosenCombinationArray.length; k++) {
                if (
                  temp[allTime[j]][parseInt(chosenCombinationArray[k])] != 0
                ) {
                  temp[allTime[j]][parseInt(chosenCombinationArray[k])] =
                    temp[allTime[j]][parseInt(chosenCombinationArray[k])] - 1;
                }
              }
              currentCapacity[j] = temp[allTime[j]];
              flag = 1;
            }
          }
        }

        if (flag) {
          reservation = await reservationsData.createReservation(
            req.session.userId,
            req.params.restaurantId,
            req.body.time,
            req.body.date,
            req.body.guests,
            chosenCombinationArray
          );
          console.log(currentCapacity);

          for (let i = 0; i < allTime.length; i++) {
            await restaurantData.addAvailability(
              req.params.restaurantId,
              currentCapacity[i],
              req.body.date,
              allTime[i]
            );
          }
          sendMail(user, restaurant, reservation);
        }

        if (!flag) {
          reservation = await reservationsData.createReservation(
            req.session.userId,
            req.params.restaurantId,
            req.body.time,
            req.body.date,
            req.body.guests,
            chosenCombinationArray
          );
          let currentCapacity = [];
          currentCapacity.push(
            JSON.parse(JSON.stringify(restaurant.restaurantTableCapacities))
          );
          //update currentCapacity
          for (i = 0; i < chosenCombinationArray.length; i++) {
            if (currentCapacity[0][parseInt(chosenCombinationArray[i])] != 0) {
              currentCapacity[0][parseInt(chosenCombinationArray[i])] =
                currentCapacity[0][parseInt(chosenCombinationArray[i])] - 1;
            }
          }
          for (let i = 0; i < allTime.length; i++) {
            await restaurantData.addAvailability(
              req.params.restaurantId,
              currentCapacity[0],
              req.body.date,
              allTime[i]
            );
          }
          sendMail(user, restaurant, reservation);
        }
      } else {
        let currentCapacity = [];
        reservation = await reservationsData.createReservation(
          req.session.userId,
          req.params.restaurantId,
          req.body.time,
          req.body.date,
          req.body.guests,
          chosenCombinationArray
        );
        currentCapacity.push(
          JSON.parse(JSON.stringify(restaurant.restaurantTableCapacities))
        );
        //update currentCapacity
        for (let i = 0; i < chosenCombinationArray.length; i++) {
          if (currentCapacity[0][parseInt(chosenCombinationArray[i])] != 0) {
            currentCapacity[0][parseInt(chosenCombinationArray[i])] =
              currentCapacity[0][parseInt(chosenCombinationArray[i])] - 1;
          }
        }
        for (let i = 0; i < allTime.length; i++) {
          await restaurantData.addAvailability(
            req.params.restaurantId,
            currentCapacity[0],
            req.body.date,
            allTime[i]
          );
        }
        sendMail(user, restaurant, reservation);
      }

      return res.redirect(`/reservations/${reservation._id}`);
    } catch (e) {
      return res.render("error", {
        error: e,
      });
    }
  });
router
  .route("/restaurant/:restaurantId/post-review")
  .get(async (req, res) => {
    return res.redirect(`/restaurant/${req.params.restaurantId}`);
  })
  .post(async (req, res) => {
    try {
      if (req.session.user) {
        let reviewTitleInput = req.body.reviewTitleInput;
        let reviewRatingInput = req.body.reviewRatingInput;
        let reviewInput = req.body.reviewInput;
        //validation
        const goodInsertedReview = await reviewsData.createReview(
          req.session.userId,
          req.params.restaurantId,
          reviewTitleInput,
          reviewInput,
          reviewRatingInput
        );
        return res.redirect(`/restaurant/${req.params.restaurantId}`);
      } else {
        return res.render("login", { title: "Login Page", hasErrors: false });
      }
    } catch (e) {
      return res.render("reviewError", {
        error: e,
        restaurantId: req.params.restaurantId,
      });
    }
  });

router.route("/restaurant/delete-review/:id").get(async (req, res) => {
  try {
    let reviewId = req.params.id;
    if (!req.session.user) {
      return res.render("login", { title: "Login Page", hasErrors: false });
    }
    const review = await reviewsData.getReviewById(reviewId);
    if (review.userId.toString() !== req.session.userId) {
      throw "You can only delete your own comment!";
    } else {
      await reviewsData.removeReview(reviewId);
      res.redirect("back");
    }
  } catch (e) {
    let reviewId = req.params.id;
    const review = await reviewsData.getReviewById(reviewId);
    return res.render("reviewError", {
      error: e,
      restaurantId: review.restaurantId,
    });
  }
});

module.exports = router;
