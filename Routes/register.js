const express = require('express');
const router = express.Router();
const User = require('../models/Campground/user');

const wrapAsync = require('../utils/wrapAsync');

//Requiring user controller
const user = require('../controller/user');

//NEW USER ROUTE

// router.get('/',(req,res)=>{
//     res.render('./user/newUser');
// })
router.get('/',user.new);


//POST ROUTE
//This wrapAsync will handle all errors and display error template but if we want to add our own custom error handler we can use try and catch inside wrapAsync

// router.post('/',wrapAsync(async(req,res,next)=>{
//     try{
//         const { username, email, password  } = req.body;
//         const user = new User({username,email})  //Notice we are not passing password. We will pass it in register method where hashed value will be stored
//         const registeredUser = await User.register(user,password)  //This takes our user object, hashes the password and stores it
//         // console.log(registeredUser);
        
//         //To make the user logged in when the user successfully registers use req.login() method
//             //Annoying thing about this is that it requires call back and we can't await it so we have pass a call back
//                 // in this case we will check if there is any error, if there are we will pass error in next
//         req.login(registeredUser,(err)=>{
//             if(err){
//                 return next(err);
//             }
//             req.flash('success','Welcome to Yelpcamp');
//             res.redirect('/index');
//          })
        
//     }
//     catch(e){
//         req.flash('error',e.message);
//         res.redirect('/register');
//     }
// }))
router.post('/',wrapAsync(user.post));
module.exports = router;