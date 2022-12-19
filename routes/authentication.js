const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const helper = require("../helpers");
const xss = require("xss");

router
  .route("/register")
  .get(async (req, res) => {
    res.render("userRegister", {
      title: "Registration Form",
      hasErrors: false,
    });
  })
  .post(async (req, res) => {
    try {
      //   FOR INPUT PRESENT USER CHECKING
      if (!xss(req.body.firstnameInput)) {
        throw [400, "Error: First Name is not provided"];
      }
      if (!xss(req.body.lastnameInput)) {
        throw [400, "Error: Last Name is not provided"];
      }
      if (!xss(req.body.emailId)) {
        throw [400, "Error: Email ID is not provided"];
      }
      if (!xss(req.body.contactInfo)) {
        throw [400, "Error: Phone Number is not provided"];
      }
      if (!xss(req.body.age)) {
        throw [400, "Error: Age is not provided"];
      }
      if (!xss(req.body.gender)) {
        throw [400, "Error: Gender is not provided"];
      }
      if (!xss(req.body.city)) {
        throw [400, "Error: City is not provided"];
      }
      if (!xss(req.body.state)) {
        throw [400, "Error: State is not provided"];
      }
      if (!xss(req.body.passwordInput)) {
        throw [400, "Error: Password is not provided"];
      }
    } catch (e) {
      return res.status(e[0]).render("userRegister", {
        title: "Registration Form",
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
    let firstName = xss(req.body.firstnameInput);
    let lastName = xss(req.body.lastnameInput);
    let emailId = xss(req.body.emailId);
    let contactInfo = xss(req.body.contactInfo);
    let age = xss(req.body.age);
    let gender = xss(req.body.gender);
    let city = xss(req.body.city);
    let state = xss(req.body.state);
    let password = xss(req.body.passwordInput);
    try {
      //   FOR ERROR CHECKING
      firstName = helper.checkIsProperString(firstName, "First Name");
      firstName = helper.validateName(firstName, "First Name");

      lastName = helper.checkIsProperString(lastName, "Last Name");
      lastName = helper.validateName(lastName, "Last Name");

      emailId = helper.checkIsProperString(emailId, "Email ID");
      emailId = helper.validateEmail(emailId, "Email ID");

      contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
      contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

      age = helper.checkIsProperString(age, "Age");
      age = helper.validateNumber(age, "Age");

      gender = helper.checkIsProperString(gender, "Gender");

      city = helper.checkIsProperString(city, "City");
      city = helper.validateCity(city, "City");

      state = helper.checkIsProperString(state, "State");

      password = helper.checkIsProperString(password, "Password");
      password = helper.checkPassword(password, "Password");
      if (helper.checkForSpaces(password)) {
        throw [400, "Error: Password should not have spaces in it"];
      }
      if (password.length < 6) {
        throw [400, `Password needs to be longer than 6 characters`];
      }
    } catch (e) {
      return res.status(e[0]).render("userRegister", {
        title: "Registration Form",
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
    try {
      let { insertedUser } = await userData.createUser(
        emailId,
        contactInfo,
        firstName,
        lastName,
        age,
        gender,
        city,
        state,
        password
      );
      if (insertedUser) {
        res.redirect("/auth/login");
      }
    } catch (e) {
      return res.status(400).render("userRegister", {
        title: "Registration Form",
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    return res.render("login", { title: "Login Page", hasErrors: false });
  })
  .post(async (req, res) => {
    try {
      if (!xss(req.body.usernameInput)) {
        throw [400, "Error: Username is not provided"];
      }
      if (!xss(req.body.passwordInput)) {
        throw [400, "Error: Password is not provided"];
      }
    } catch (e) {
      return res.status(e[0]).render("userLogin", {
        title: "Login",
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
    let username = xss(req.body.usernameInput);
    let password = xss(req.body.passwordInput);
    try {
      //   FOR CHECKING INPUT VALIDATION
      username = helper.checkIsProperString(username, "Username");
      password = helper.checkIsProperString(password, "Password");
    } catch (e) {
      return res.status(e[0]).render("userLogin", {
        title: "Login",
        hasErrors: true,
        error: `${e[1]}`,
      });
    }
    try {
      let { authenticatedUser } = await userData.checkUser(username, password);
      let { authenticatedAdmin } = await userData.checkUser(username, password);

      if (authenticatedUser) {
        req.session.user = username.toLowerCase();
        let user = await userData.getUserByUsername(username);
        let userId = user._id;
        let firstName = user.firstName;
        req.session.userId = userId;
        req.session.name = firstName;
        req.session.tag = "user";
        return res.redirect("/");
      }
      if (authenticatedAdmin) {
        req.session.user = username.toLowerCase();
        let user = await userData.getUserByUsername(username);
        let adminId = user._id;
        let firstName = user.firstName;
        req.session.userId = adminId;
        req.session.name = firstName;
        req.session.tag = "admin";
        return res.redirect("/");
      }
    } catch (e) {
      return res
        .status(e[0])
        .render("login", { title: "Login", hasErrors: true, error: `${e[1]}` });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("login", {
    title: "Logged Out",
    loggedOut: "Successfully logged out",
  });
});

module.exports = router;
