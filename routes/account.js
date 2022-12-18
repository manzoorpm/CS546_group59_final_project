const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const reservationData = data.reservations;
const helper = require("../helpers");

router.route("/:userId").get(async (req, res) => {
  let user = await userData.getUserById(req.session.userId);
  console.log(req.session.userTag);
  let reservationList = await reservationData.getAllUserReservations(
    req.session.userId
  );
  return res.render("account", {
    title: "User Profile",
    user: user,
    reservations: reservationList,
    userId: req.session.userId,
    userTag: req.session.userTag,
    name: req.session.name,
    hasErrors: false,
  });
});
router
  .route("/edit/:userId")
  .get(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    return res.render("editAccount", {
      title: "Edit User Profile",
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
    // try{
    // //   FOR INPUT PRESENT USER CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    let firstName = req.body.firstnameInput;
    let lastName = req.body.lastnameInput;
    let emailId = req.body.emailId;
    let contactInfo = req.body.contactInfo;
    let age = req.body.age;
    let gender = req.body.gender;
    let city = req.body.city;
    let state = req.body.state;
    // try{
    // //   FOR ERROR CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    try {
      let { updatedUser } = await userData.updateUser(
        req.session.userId,
        emailId,
        contactInfo,
        firstName,
        lastName,
        age,
        gender,
        city,
        state
      );
      if (updatedUser) {
        return res.redirect(`/account/${req.session.userId}`);
      }
    } catch (e) {
      return res.status(400).render("editAccount", {
        title: "Edit User Profile",
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

//   return res.render("editAccount", {
//     title: "Edit User Profile",
//     user: req.session.user,
//     userId: req.session.userId,
//     userTag: req.session.userTag,
//     name: req.session.name,
//     hasErrors: false,
//   });
// });
router
  .route("/remove/:userId")
  .get(async (req, res) => {
    let user = await userData.getUserById(req.session.userId);
    return res.render("removeAccount", {
      title: "User Profile",
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
    // user params id and session id comparison
    try {
      let { deletedUser } = await userData.removeUser(req.session.userId);
      if (deletedUser) {
        return res.redirect(`/auth/logout`);
      }
    } catch (e) {
      return res.status(400).render("removeAccount", {
        title: "Delete User Profile",
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
