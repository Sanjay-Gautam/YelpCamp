const express = require('express');
const router = express.Router({mergeParams:true});


const wrapAsync = require('../utils/wrapAsync');
const errorClass = require('../utils/errorClass');

const Campground = require('../models/Campground/index');
const Review = require('../models/Campground/review');

const {schemaReview} = require('../Schemas/validationSchema');

const {isLoggedIn,isReviewAuthor} = require('../middleware')

//Middleware to validate reviews
const {validateSchema2} = require('../middleware');

//Requiring controller for review
const review = require('../controller/review');
//POST ROUTE
// router.post('/review',isLoggedIn,validateSchema2,wrapAsync(async(req,res)=>{
//     //fetch the campground first
//     const camp = await Campground.findById(req.params.id);
//     const reviewData = new Review(req.body.review);
//     //Add author to the review i.e., the current User
//     reviewData.author = req.user._id;
//     camp.review.push(reviewData);
//     await reviewData.save();
//     await camp.save();
//     req.flash('success',"Created new review")
//     res.redirect(`/index/${req.params.id}`);
// }))
router.post('/review',isLoggedIn,validateSchema2,wrapAsync(review.post));

//DELETE ROUTE
// router.delete('/review/:rid',isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
//     const {id,rid} = req.params;
//     await Campground.findByIdAndUpdate(id,{$pull:{review:rid}});
//     await Review.findByIdAndDelete(rid);
//     req.flash('success','Review Deleted!');
//     res.redirect(`/index/${id}`);
// }))
router.delete('/review/:rid',isLoggedIn,isReviewAuthor,wrapAsync(review.delete));


module.exports = router;