const express = require('express');
const router = express.Router();
const User = require('../models/Campground/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

//Requiring user controller
const login = require('../controller/login');
//INDEX (LOGIN PAGE) route
// router.get('/',(req,res)=>{
//     res.render('./user/login');
// })
router.get('/',login.index);


//POST ROUTE
//****Passport gives us a middleware called passport.authenticate('strategy') */

// router.post('/',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),wrapAsync(async(req,res)=>{
//     //If we made it till here we know user is valid
//     req.flash('success','Welcome back');

//     //see if there is a desiredUrl
//     const {desiredPath='/index'} = req.session;
    
//     //Now delete that desiredPath stored in session
//     delete req.session.desiredPath;
//     res.redirect(desiredPath);
// }));

router.post('/',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),wrapAsync(login.post));

module.exports = router;