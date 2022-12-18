const express = require("express");
const { reservations } = require("../data");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const reservationsData = data.reservations;
const helper = require("../helpers");

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

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
      restaurantCapacity = restaurantCapacity + key * p[key];
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

function getAllTime(time) {
  let getAllTimeArray = [];
  getAllTimeArray.push(time);
  let openingTimeHour = parseInt(time.split(":")[0]);
  let openingTimeMin = parseInt(time.split(":")[1]);

  for (let i = 0; i < 3; i++) {
    ///fix 24 +
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
    getAllTimeArray.push(currentTime);
  }
  return getAllTimeArray;
}

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

// function getAvailabilityObject(capacity, time, date) {
//   let newValue = {};
//   let timeValue = {};
//   timeValue[time] = capacity;
//   newValue[date] = timeValue;
//   return newValue;
// }

function objectToArrayOfAvailability(object) {
  let availabilityObject = object;
  let availabilityArray = [];
  for (var key in availabilityObject) {
    if (availabilityObject.hasOwnProperty(key)) {
      for (let i = 0; i < availabilityObject[key]; i++) {
        availabilityArray.push(key);
      }
    }
  }
  return availabilityArray;
}

function intialObjectMaker(date, allTime, capacity) {
  objInner = {};
  for (i = 0; i < allTime.length; i++) {
    objInner[allTime[i]] = capacity[0];
  }
  return objInner;
}

function getTableCombinationSlots(availabilityObject, guests) {
  availabilityArray = objectToArrayOfAvailability(availabilityObject);

  if (guests % 2 == 0) {
    guests = parseInt(guests);
  } else {
    guests = parseInt(guests) + 1;
  }

  if (getTableCombinations(availabilityArray, guests).length == 0)
    throw "no available sets";
  var tableCombinations = getTableCombinations(availabilityArray, guests);
  var tableCombinationSlots = [];
  for (let i = 0; i < tableCombinations.length; i++) {
    tableCombinationSlots.push(tableCombinations[i].join(" and "));
  }
  return tableCombinationSlots;
}

router.route("/").get(async (req, res) => {
  let restaurants = await restaurantData.getAllRestaurants();
  return res.render("home", {
    title: "Explore Restaurants",
    user: req.session.user,
    userId: req.session.userId,
    userTag: req.session.tag,
    name: req.session.name,
    restaurantId: req.params.restaurantId,
    restaurants: restaurants,
    hasErrors: false,
  });
});

router
  .route("/restaurant/:restaurantId")
  .get(async (req, res) => {
    //code here for GET
    try {
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
    } catch (e) {
      return res.redirect("/exceptions/error");
    }
  })
  .post(async (req, res) => {
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    let restaurantCapacity = getRestaurantCapacity(restaurant);
    let flag = 0;
    let availabilityObject;

    let allTime = getAllTime(req.body.time);

    if (!isEmptyObject(restaurant.availibility)) {
      var multipleAvailabilityArray = [];
      let temp;
      if (restaurant.availibility[format(req.body.date)]) {
        temp = restaurant.availibility[format(req.body.date)];
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
          temp = getTableCombinationSlots(
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
        console.log("fff");

        tableCombinationSlots = getTableCombinationSlots(
          restaurant.restaurantTableCapacities,
          req.body.guests
        );
      }
    } else {
      console.log("yay!");
      tableCombinationSlots = getTableCombinationSlots(
        restaurant.restaurantTableCapacities,
        req.body.guests
      );
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
      guests: req.body.guests,
      restaurant: restaurant,
      restaurantId: req.params.restaurantId,
      restaurantCapacity: restaurantCapacity,
      hasErrors: false,
    });
  });

router
  .route("/restaurant/:restaurantId/addreservation")
  .post(async (req, res) => {
    var temp;
    let flag = 0;
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    let allTime = getAllTime(req.body.time);

    chosenCombinationArray = req.body.chosenCombination.split(" and ");

    if (!isEmptyObject(restaurant.availibility)) {
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

      if (restaurant.availibility[format(req.body.date)]) {
        temp = restaurant.availibility[format(req.body.date)];
        for (let j = 0; j < allTime.length; j++) {
          if (temp[allTime[j]]) {
            for (let k = 0; k < chosenCombinationArray.length; k++) {
              if (temp[allTime[j]][parseInt(chosenCombinationArray[k])] != 0) {
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
        console.log(currentCapacity);

        for (let i = 0; i < allTime.length; i++) {
          await restaurantData.addAvailability(
            req.params.restaurantId,
            currentCapacity[i],
            format(req.body.date),
            allTime[i]
          );
        }
      }

      if (!flag) {
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
            format(req.body.date),
            allTime[i]
          );
        }
      }
    } else {
      let currentCapacity = [];
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

      // obj = intialObjectMaker(format(req.body.date), allTime, currentCapacity);
      // console.log(obj);
      for (let i = 0; i < allTime.length; i++) {
        await restaurantData.addAvailability(
          req.params.restaurantId,
          currentCapacity[0],
          format(req.body.date),
          allTime[i]
        );
      }
    }

    try {
      let reservation = await reservationsData.createReservation(
        req.session.userId,
        req.params.restaurantId,
        req.body.time,
        req.body.time,
        req.body.guests,
        chosenCombinationArray
      );

      return res.render("reservation", {
        title: restaurant.name,
        user: req.session.user,
        userId: req.session.userId,
        userTag: req.session.tag,
        name: req.session.name,
        restaurantId: req.params.restaurantId,
        reservation: reservation,
        hasErrors: false,
      });
    } catch (e) {
      console.log(e);
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
