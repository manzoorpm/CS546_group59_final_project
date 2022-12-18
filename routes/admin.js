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
    let contactInfo = req.body.contactInfo;
    let description = req.body.description;
    let mainImage = req.file.destination + "/" + req.file.filename;
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
    // restaurantTableCapacities = JSON.parse(restaurantTableCapacities);
    // console.log(restaurantTableCapacities);

    // try{
    // //   FOR ERROR CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    try {
      let { insertedRes } = await restaurantData.createRestaurant(
        name,
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
  .post(async (req, res) => {});

router
  .route("/restaurant/delete/:restaurantId")
  .get(async (req, res) => {})
  .post(async (req, res) => {});

module.exports = router;
