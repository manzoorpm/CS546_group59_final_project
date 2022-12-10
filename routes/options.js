const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users
const helper = require('../helpers');

router
.route("/")
.get(async (req, res) => {
    //code here for GET
    if(req.session.user){
        return res.redirect('/user')
    }
    if(req.session.admin){
        return res.redirect('/admin')
    }
    if(req.session.resClient){
        return res.redirect('/restaurantClient')
    }
    return res.render('login',{title:"Login Page", hasErrors:false})
});

router
  .route('/register')
  .get(async (req, res) => {
    if(req.session.user){
        return res.redirect('/user')
    }
    if(req.session.admin){
        return res.redirect('/admin')
    }
    if(req.session.resClient){
        return res.redirect('/restaurantClient')
    }
    else{
      res.render('userRegister',{title:"Registration Form", hasErrors:false} )
    }
  })

  .post(async (req, res) => {
    if(req.session.user){
        return res.redirect('/user')
    }
    if(req.session.admin){
        return res.redirect('/admin')
    }
    if(req.session.resClient){
        return res.redirect('/restaurantClient')
    }
    // try{
    // //   FOR INPUT PRESENT USER CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    let firstName = req.body.firstnameInput
    let lastName = req.body.lastnameInput
    let emailId = req.body.emailId
    let contactInfo = req.body.contactInfo
    let age = req.body.age
    let gender = req.body.gender
    let city = req.body.city
    let state = req.body.state
    let password = req.body.passwordInput
    // try{
    // //   FOR ERROR CHECKING
    // }catch(e){
    //   return res.status(e[0]).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    // }
    try{
      let {insertedUser} = await userData.createUser(emailId,contactInfo,firstName,lastName,age,gender,city,state,password)
      if(insertedUser){
        res.redirect('/')
      }
    }catch(e){
        return res.status(400).render('userRegister',{title:"Registration Form", hasErrors:true, error:`${e[1]}`})
    }
  })

router
  .route('/login')
  .post(async (req, res) => {
    if(req.session.user){
        return res.redirect('/user')
    }
    if(req.session.admin){
        return res.redirect('/admin')
    }
    if(req.session.resClient){
        return res.redirect('/restaurantClient')
    }
    try{
      if(!req.body.usernameInput){
        [400,"Error: Username is not provided"]
      }
      if(!req.body.passwordInput){
        [400,"Error: Password is not provided"]
      }
    }catch(e){
      return res.status(e[0]).render('userLogin',{title:"Login", hasErrors:true, error:`${e[1]}`})
    }
    let username = req.body.usernameInput
    let password = req.body.passwordInput
    // try{
    // //   FOR CHECKING INPUT VALIDATION
    // }catch(e){
    //   return res.status(e[0]).render('userLogin',{title:"Login", hasErrors:true, error:`${e[1]}`})
    // }
    try{
      let {authenticatedUser} = await userData.checkUser(username,password)
      let {authenticatedAdmin} = await userData.checkUser(username,password)
      if(authenticatedUser){
        req.session.user = username.toLowerCase()
        let user = await userData.getUserByUsername(username)
        let userId = user._id
        req.session.userId = userId
        res.redirect('/user')
      }
      if(authenticatedAdmin){
        req.session.admin = username.toLowerCase()
        let user = await userData.getUserByUsername(username)
        let userId = user._id
        req.session.userId = userId
        res.redirect('/admin')
      }
    }catch(e){
      return res.status(e[0]).render('login',{title:"Login", hasErrors:true, error:`${e[1]}`})
    }
  })

router
  .route('/logout')
  .get(async (req, res) => {
    req.session.destroy()
    return res.render('login', {title:"Logged Out",loggedOut:"Successfully logged out"})
  })

module.exports = router