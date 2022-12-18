const express = require("express");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const userData = data.users;
const helper = require("../helpers");

router
  .route("/restaurant/add")
  .get(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    return res.render("addRestaurant", {
      title: "Add Restaurant",
      user: user,
      userId: req.session.userId,
      userTag: req.session.tag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    // try{
    // //   FOR INPUT PRESENT USER CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    let name = req.body.name;
    let emailId = req.body.emailId;
    let contactInfo = req.body.contactInfo;
    let description = req.body.description;
    let mainImage = req.file.destination.slice(1) + "/" + req.file.filename;
    let priceRange = req.body.priceRange;
    let category = req.body.category;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let openingTime = req.body.openingTime;
    let closingTime = req.body.closingTime;
    let TableFor2 = req.body.TableFor2;
    let TableFor4 = req.body.TableFor4;
    let TableFor6 = req.body.TableFor6;
    let TableFor8 = req.body.TableFor8;
    let TableFor10 = req.body.TableFor10;
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
      return res.render("addRestaurant", {
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
        userTag: req.session.tag,
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
      userTag: req.session.tag,
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
    // try{
    // //   FOR INPUT PRESENT USER CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    let name = req.body.name;
    let emailId = req.body.emailId;
    let contactInfo = req.body.contactInfo;
    let description = req.body.description;
    let priceRange = req.body.priceRange;
    let category = req.body.category;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let openingTime = req.body.openingTime;
    let closingTime = req.body.closingTime;
    let TableFor2 = req.body.TableFor2;
    let TableFor4 = req.body.TableFor4;
    let TableFor6 = req.body.TableFor6;
    let TableFor8 = req.body.TableFor8;
    let TableFor10 = req.body.TableFor10;
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
        userTag: req.session.tag,
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
        userTag: req.session.tag,
        name: req.session.name,
        loggedIn: true,
        hasErrors: true,
        error: `${e}`,
      });
    }
  });

router.route("/restaurant/delete/:restaurantId").post(async (req, res) => {
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
      userTag: req.session.tag,
      name: req.session.name,
      loggedIn: true,
      hasErrors: true,
      error: `${e}`,
    });
  }
});

module.exports = router;
