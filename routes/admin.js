const express = require("express");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const userData = data.users;
const helper = require("../helpers");
const xss = require("xss");

router
  .route("/restaurant/add")
  .get(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    return res.render("addRestaurant", {
      title: "Add Restaurant",
      user: user,
      userId: req.session.userId,
      userTag: req.session.userTag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    try {
      //   FOR INPUT PRESENT USER CHECKING
      if (!req.file) {
        throw [400, "Image not suppliied"];
      }
      if (!xss(req.body.name)) {
        throw [400, "Name not defined"];
      }
      if (!xss(req.body.emailId)) {
        throw [400, "email ID not defined"];
      }
      if (!xss(req.body.contactInfo)) {
        throw [400, "Contact Info not defined"];
      }
      if (!xss(req.body.description)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.priceRange)) {
        throw [400, "Table for 10 not defined"];
      }
      if (!xss(req.body.category)) {
        throw [400, "Table for 2 not defined"];
      }
      if (!xss(req.body.address)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.city)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.state)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.zip)) {
        throw [400, "Table for 10 not defined"];
      }
      if (!xss(req.body.latitude)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.longitude)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.openingTime)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.closingTime)) {
        throw [400, "Table for 10 not defined"];
      }

      if (!xss(req.body.TableFor2)) {
        throw [400, "Table for 2 not defined"];
      }
      if (!xss(req.body.TableFor4)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.TableFor6)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.TableFor8)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.TableFor10)) {
        throw [400, "Table for 10 not defined"];
      }
    } catch (e) {
      console.log(e);
      return res.status(e[0]).render("addRestaurant", {
        title: "Add Restaurant",
        user: user,
        userId: req.session.userId,
        userTag: req.session.tag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
    let name = xss(req.body.name);
    let emailId = xss(req.body.emailId);
    let contactInfo = xss(req.body.contactInfo);
    let description = xss(req.body.description);
    let mainImage = req.file.destination.slice(1) + "/" + req.file.filename;
    let priceRange = xss(req.body.priceRange);
    let category = xss(req.body.category);
    let address = xss(req.body.address);
    let city = xss(req.body.city);
    let state = xss(req.body.state);
    let zip = xss(req.body.zip);
    let latitude = xss(req.body.latitude);
    let longitude = xss(req.body.longitude);
    let openingTime = xss(req.body.openingTime);
    let closingTime = xss(req.body.closingTime);
    let TableFor2 = xss(req.body.TableFor2);
    let TableFor4 = xss(req.body.TableFor4);
    let TableFor6 = xss(req.body.TableFor6);
    let TableFor8 = xss(req.body.TableFor8);
    let TableFor10 = xss(req.body.TableFor10);
    let restaurantTableCapacities = {
      2: parseInt(TableFor2),
      4: parseInt(TableFor4),
      6: parseInt(TableFor6),
      8: parseInt(TableFor8),
      10: parseInt(TableFor10),
    };
    try {
      //   FOR ERROR CHECKING
      name = helper.checkIsProperString(name, "Restaurant Name");
      name = helper.validateCity(name, "Restaurant Name");

      emailId = helper.checkIsProperString(emailId, "Email ID");
      emailId = helper.validateEmail(emailId, "Email ID");

      contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
      contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

      description = helper.checkIsProperString(description, "Description");

      mainImage = helper.checkIsProperString(mainImage, "Image Link");

      priceRange = helper.checkIsProperString(priceRange, "Price Range");
      priceRange = helper.validateNumber(priceRange, "Price Range");

      category = helper.checkIsProperString(category, "Category");
      category = helper.validateCategory(category, "Category");

      address = helper.checkIsProperString(address, "Address");

      city = helper.checkIsProperString(city, "City");
      city = helper.validateCity(city, "City");

      state = helper.checkIsProperString(state, "State");
      if (!(state !== "New Jersey" || state !== "New York")) {
        throw [400, `Currently servicing only in New York and New Jersey`];
      }

      zip = helper.checkIsProperString(zip, "Zip");
      if (zip.length > 5 || zip.length < 4) {
        throw [400, `Zip Code Invalid Length`];
      }
      zip = helper.validateNumber(zip, "Zip");

      latitude = helper.checkIsProperString(latitude, "Latitude");
      latitude = helper.validateLatitudeLongitude(latitude, "Latitude");

      longitude = helper.checkIsProperString(longitude, "Longitude");
      longitude = helper.validateLatitudeLongitude(longitude, "Longitude");

      openingTime = helper.checkIsProperString(openingTime, "Opening Time");

      closingTime = helper.checkIsProperString(closingTime, "Closing Time");
    } catch (e) {
      return res.status(e[0]).render("addRestaurant", {
        title: "Add Restaurant",
        user: user,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
    try {
      let insertedRes = await restaurantData.createRestaurant(
        name,
        emailId,
        contactInfo,
        description,
        mainImage,
        priceRange,
        category,
        address,
        city,
        state,
        zip,
        latitude,
        longitude,
        openingTime,
        closingTime,
        restaurantTableCapacities
      );
      if (insertedRes) {
        return res.redirect("/");
      }
    } catch (e) {
      return res.status(400).render("addRestaurant", {
        title: "Add Restaurant",
        user: user,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
  });

router
  .route("/restaurant/edit/:restaurantId")
  .get(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    return res.render("adminUpdateRemoveRestaurant", {
      title: "Edit Restaurant",
      user: user,
      restaurant: restaurant,
      userId: req.session.userId,
      userTag: req.session.userTag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    let restaurant = await restaurantData.getRestaurantById(
      req.params.restaurantId
    );
    try {
      //   FOR INPUT PRESENT USER CHECKING
      if (!xss(req.body.name)) {
        throw [400, "Name not defined"];
      }
      if (!xss(req.body.emailId)) {
        throw [400, "email ID not defined"];
      }
      if (!xss(req.body.contactInfo)) {
        throw [400, "Contact Info not defined"];
      }
      if (!xss(req.body.description)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.priceRange)) {
        throw [400, "Table for 10 not defined"];
      }
      if (!xss(req.body.category)) {
        throw [400, "Table for 2 not defined"];
      }
      if (!xss(req.body.address)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.city)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.state)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.zip)) {
        throw [400, "Table for 10 not defined"];
      }
      if (!xss(req.body.latitude)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.longitude)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.openingTime)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.closingTime)) {
        throw [400, "Table for 10 not defined"];
      }

      if (!xss(req.body.TableFor2)) {
        throw [400, "Table for 2 not defined"];
      }
      if (!xss(req.body.TableFor4)) {
        throw [400, "Table for 4 not defined"];
      }
      if (!xss(req.body.TableFor6)) {
        throw [400, "Table for 6 not defined"];
      }
      if (!xss(req.body.TableFor8)) {
        throw [400, "Table for 8 not defined"];
      }
      if (!xss(req.body.TableFor10)) {
        throw [400, "Table for 10 not defined"];
      }
    } catch (e) {
      return res.status(400).render("adminUpdateRemoveRestaurant", {
        title: "Edit Restaurant",
        user: user,
        restaurant: restaurant,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
    let name = xss(req.body.name);
    let emailId = xss(req.body.emailId);
    let contactInfo = xss(req.body.contactInfo);
    let description = xss(req.body.description);
    let priceRange = xss(req.body.priceRange);
    let category = xss(req.body.category);
    let address = xss(req.body.address);
    let city = xss(req.body.city);
    let state = xss(req.body.state);
    let zip = xss(req.body.zip);
    let latitude = xss(req.body.latitude);
    let longitude = xss(req.body.longitude);
    let openingTime = xss(req.body.openingTime);
    let closingTime = xss(req.body.closingTime);
    let TableFor2 = xss(req.body.TableFor2);
    let TableFor4 = xss(req.body.TableFor4);
    let TableFor6 = xss(req.body.TableFor6);
    let TableFor8 = xss(req.body.TableFor8);
    let TableFor10 = xss(req.body.TableFor10);
    let restaurantTableCapacities = {
      2: parseInt(TableFor2),
      4: parseInt(TableFor4),
      6: parseInt(TableFor6),
      8: parseInt(TableFor8),
      10: parseInt(TableFor10),
    };
    try {
      //   FOR ERROR CHECKING
      name = helper.checkIsProperString(name, "Restaurant Name");
      name = helper.validateCity(name, "Restaurant Name");

      emailId = helper.checkIsProperString(emailId, "Email ID");
      emailId = helper.validateEmail(emailId, "Email ID");

      contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
      contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

      description = helper.checkIsProperString(description, "Description");

      priceRange = helper.checkIsProperString(priceRange, "Price Range");
      priceRange = helper.validateNumber(priceRange, "Price Range");

      category = helper.checkIsProperString(category, "Category");
      category = helper.validateCategory(category, "Category");

      address = helper.checkIsProperString(address, "Address");

      city = helper.checkIsProperString(city, "City");
      city = helper.validateCity(city, "City");

      state = helper.checkIsProperString(state, "State");
      if (!(state !== "New Jersey" || state !== "New York")) {
        throw [400, `Currently servicing only in New York and New Jersey`];
      }

      zip = helper.checkIsProperString(zip, "Zip");
      zip = helper.validateNumber(zip, "Zip");
      if (zip.length != 5) {
        throw [400, `Zip Code Invalid Length`];
      }

      latitude = helper.checkIsProperString(latitude, "Latitude");
      latitude = helper.validateLatitudeLongitude(latitude, "Latitude");

      longitude = helper.checkIsProperString(longitude, "Longitude");
      longitude = helper.validateLatitudeLongitude(longitude, "Longitude");

      openingTime = helper.checkIsProperString(openingTime, "Opening Time");
      openingTime = helper.validateTime(openingTime, "Opening Time");

      closingTime = helper.checkIsProperString(closingTime, "Closing Time");
      closingTime = helper.validateTime(closingTime, "Closing Time");

      helper.compareTime(closingTime, openingTime);
    } catch (e) {
      return res.render("adminUpdateRemoveRestaurant", {
        title: "Edit Restaurant",
        user: user,
        restaurant: restaurant,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
    try {
      let updatedRes = await restaurantData.updateRestaurant(
        req.params.restaurantId,
        name,
        emailId,
        contactInfo,
        description,
        priceRange,
        category,
        address,
        city,
        state,
        zip,
        latitude,
        longitude,
        openingTime,
        closingTime,
        restaurantTableCapacities
      );
      if (updatedRes) {
        return res.redirect("/");
      }
    } catch (e) {
      return res.status(400).render("adminUpdateRemoveRestaurant", {
        title: "Edit Restaurant",
        user: user,
        restaurant: restaurant,
        userId: req.session.userId,
        userTag: req.session.userTag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
  });

router.route("/restaurant/delete/:restaurantId/").post(async (req, res) => {
  let user = await userData.getUserById(req.session.userId);
  let restaurant = await restaurantData.getRestaurantById(
    req.params.restaurantId
  );
  try {
    let deletedRes = await restaurantData.removeRestaurant(
      req.params.restaurantId
    );
    if (deletedRes) {
      return res.redirect("/");
    }
  } catch (e) {
    return res.status(400).render("/", {
      title: "Delete Error",
      user: user,
      userId: req.session.userId,
      userTag: req.session.userTag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: true,
      error: `${e}`,
    });
  }
});

module.exports = router;
