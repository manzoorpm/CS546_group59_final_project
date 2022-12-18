const express = require("express");
const { reservations } = require("../data");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const reservationsData = data.reservations;
const helper = require("../helpers");

function format(input) {
  var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!input || !input.match(pattern)) {
    return null;
  }
  return input.replace(pattern, "$2/$3/$1");
}

function getRestaurantCapacity(restaurant) {
  let restaurantCapacity = 0;
  let p = restaurant.restaurantTableCapacities;
  for (var key in p) {
    if (p.hasOwnProperty(key)) {
      restaurantCapacity = restaurantCapacity + parseInt(key) * p[key];
    }
  }
  return restaurantCapacity;
}

var getTableCombinations = function (candidates, target) {
  candidates.sort((a, b) => a - b);
  return backtrack(candidates, target);
};

var backtrack = function (candidates, target) {
  let res = [];

  for (const [ind, candidate] of candidates.entries()) {
    if (candidates[ind - 1] == candidate) continue;
    if (candidate < target) {
      let subResult = backtrack(candidates.slice(ind + 1), target - candidate);
      subResult.map((sub) => sub.unshift(candidate));
      if (subResult.length > 0) res.push(...subResult);
    } else {
      if (candidate == target) res.push([candidate]);
      break;
    }
  }

  return res;
};

function getTimeSlots(openingTime, closingTime) {
  let availabilityArray = [];
  let currentTime = "";
  let currentTimeHour = "";
  let currentTimeMin = "";
  let openingTimeHour = parseInt(openingTime.split(":")[0]);
  let openingTimeMin = parseInt(openingTime.split(":")[1]);

  availabilityArray.push(openingTime);

  while (currentTime != closingTime) {
    if (openingTimeMin == 0) openingTimeMin = 30;
    else {
      openingTimeHour = openingTimeHour + 1;
      openingTimeMin = 0;
    }
    if (openingTimeHour.toString().length == 1) {
      currentTimeHour = "0" + openingTimeHour;
    } else {
      currentTimeHour = openingTimeHour;
    }
    if (openingTimeMin.toString().length == 1) {
      currentTimeMin = "0" + openingTimeMin;
    } else {
      currentTimeMin = openingTimeMin;
    }
    currentTime = currentTimeHour + ":" + currentTimeMin;
    availabilityArray.push(currentTime);
  }
  return availabilityArray;
}

function getAvailabilityObject(capacity, time, date) {
  let newValue = {};
  let timeValue = {};
  timeValue[time] = capacity;
  newValue[date] = timeValue;
  return newValue;
}

function objectToArrayOfAvailability(object, date, time) {
  let availabilityObjectDate = object[date];
  let availabilityObject = availabilityObjectDate[time];
  let availabilityArray = [];
  for (var key in availabilityObject) {
    if (availabilityObject.hasOwnProperty(key)) {
      for (i = 0; i < availabilityObject[key]; i++) {
        availabilityArray.push(key);
      }
    }
  }
  return availabilityArray;
}

router.route("/").get(async (req, res) => {
  let restaurants = await restaurantData.getAllRestaurants();
  return res.render("home", {
    title: "Explore Restaurants",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.tag,
    name: req.session.name,
    restaurants: restaurants,
    hasErrors: false,
  });
});

router
  .route("/restaurant/:restaurantId")
  .get(async (req, res) => {
    //code here for GET
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    let restaurantCapacity = getRestaurantCapacity(restaurant);

    if (req.body.guests > restaurantCapacity)
      throw "The restaurant cannot accomodate entered number of guests";

    availabilityAll = getTimeSlots(
      restaurant.openingTime,
      restaurant.closingTime
    );

    return res.render("restaurant", {
      title: restaurant.name,
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      restaurant: restaurant,
      restaurantId: req.params.restaurantId,
      availabilityAll: availabilityAll,
      restaurantCapacity: restaurantCapacity,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    let restaurantCapacity = getRestaurantCapacity(restaurant);
    let flag = 0;
    let availabilityObject;
    if (restaurant.availibility.length > 0) {
      for (i = 0; i < restaurant.availibility.length; i++) {
        if (restaurant.availibility[i][format(req.body.date)]) {
          availabilityObject = restaurant.availibility[i];
          flag = 1;
          break;
        }
      }
      if (!flag) {
        availabilityObject = getAvailabilityObject(
          restaurant.restaurantTableCapacities,
          req.body.time,
          format(req.body.date)
        );
      }
    } else {
      availabilityObject = getAvailabilityObject(
        restaurant.restaurantTableCapacities,
        req.body.time,
        format(req.body.date)
      );
    }

    availabilityArray = objectToArrayOfAvailability(
      availabilityObject,
      format(req.body.date),
      req.body.time
    );

    let guests;
    if (req.body.guests % 2 == 0) {
      guests = parseInt(req.body.guests);
    } else {
      guests = parseInt(req.body.guests) + 1;
    }

    if (getTableCombinations(availabilityArray, guests).length == 0)
      throw "no available sets";
    let tableCombinations = getTableCombinations(availabilityArray, guests);
    let tableCombinationSlots = [];
    for (let i = 0; i < tableCombinations.length; i++) {
      tableCombinationSlots.push(tableCombinations[i].join(" and "));
    }

    return res.render("restaurant", {
      title: restaurant.name,
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      tableCombinationSlots: tableCombinationSlots,
      time: req.body.time,
      date: req.body.date,
      restaurant: restaurant,
      restaurantId: req.params.restaurantId,
      restaurantCapacity: restaurantCapacity,
      hasErrors: false,
    });
  });

router
  .route("/restaurant/:restaurantId/addreservation")
  .post(async (req, res) => {
    let flag = 0;
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );

    chosenCombinationArray = req.body.chosenCombination.split(" and ");

    if (restaurant.availibility.length > 0) {
      for (i = 0; i < restaurant.availibility.length; i++) {
        if (restaurant.availibility[i][format(req.body.date)]) {
          currentCapacity =
            restaurant.availibility[i][format(req.body.date)][req.body.time];
          flag = 1;
          break;
        }
      }
      if (!flag) {
        currentCapacity = restaurant.restaurantTableCapacities;
      }
    } else {
      currentCapacity = restaurant.restaurantTableCapacities;
    }

    for (i = 0; i < chosenCombinationArray.length; i++) {
      if (currentCapacity[parseInt(chosenCombinationArray[i])] != 0) {
        currentCapacity[parseInt(chosenCombinationArray[i])] =
          currentCapacity[parseInt(chosenCombinationArray[i])] - 1;
      }
    }

    let availabilityObject = getAvailabilityObject(
      currentCapacity,
      req.body.time,
      format(req.body.date)
    );
    await restaurantData.updateAvailability(
      restaurantId,
      availabilityObject,
      time,
      date
    );
    // await reservationsData.createReservation{
    //   userId,
    //   restaurantId,
    //   reservationTime,
    //   reservationDate,
    //   people
    // }''

    return res.render("reservation", {
      title: restaurant.name,
      user: req.session.user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      restaurantId: req.params.restaurantId,
      hasErrors: false,
    });
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
        const goodInsertedReview = await reviewData.createReview(
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
      req.session.message = e;
      res.redirect("back");
    }
  });

router.route("/restaurant/delete-review/:id").get(async (req, res) => {
  try {
    let reviewId = req.params.id;
    if (!req.session.user) {
      return res.render("login", { title: "Login Page", hasErrors: false });
    }
    const review = await reviewData.getReviewById(reviewId);
    if (review.userId.toString() !== req.session.userId) {
      throw "You can only delete your own comment!";
    } else {
      await reviewData.removeReview(reviewId);
      res.redirect("back");
    }
  } catch (e) {
    req.session.message = e;
    res.redirect("back");
  }
});

module.exports = router;
