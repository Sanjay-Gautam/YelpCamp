const express = require('express');
const router = express.Router();
const flash = require('connect-flash');

const multer = require('multer');
// const upload = mutler({dest:'uploads/'}); //local destination

const {storage} = require('../cloudinary/index');
const upload = multer({storage}); //no more storing locally
//Requiring errorClass
const errorClass = require('../utils/errorClass');


//Requiring Campground Model
const Campground = require('../models/Campground/index');

//Requiring wrapAsync function
const wrapAsync = require('../utils/wrapAsync');

//Requiring Joi Validation Schemas
const {errorSchema} = require('../Schemas/validationSchema');

//Requiring middleware to see if user is logged in
const {isLoggedIn} = require('../middleware');

//Middleware to validate Campground
const {validateSchema} = require('../middleware');

//Middleware to check if the current user is author of the campground 
const {isAuthor} = require('../middleware');

//Controller for index page
const campground = require('../controller/campground');

// //HANDLED ERRORS USING TRY-CATCH for index, new and show routes
//INDEX ROUTE
// router.get('/',async (req,res)=>{
//     try{
//         //Get all campgrounds from database
//         const camps = await Campground.find({});
//         res.render('./campground/index',{camps:camps});
//     }catch(e)
//     {
//         next(e);
//     }
    
// })

router.get('/',campground.index);

//NEW ROUTE
//Now we will make sure that only logged in user can access this route.
    //passport automatically adds req.isAuthenticated() helper method 
// router.get('/new',isLoggedIn,(req,res)=>{
//     // if(!req.isAuthenticated()){
//     //     req.flash('error','You must be logged In');
//     //     res.redirect('/login');
//     // }
//     // else{ Now using middleware to check if a user is logged in
//         try{
//             res.render('./campground/new');
//         }catch(e)
//         {
//             next(e);
//         }
// // }
    
// })
router.get('/new',isLoggedIn,campground.new);

//SHOW ROUTE
// router.get('/:id',async (req,res,next)=>{
//     try{
//         //Find camp with given id
//           //Here we are populating author and review associated with each campground
//         // const camp = await Campground.findById(req.params.id).populate('review').populate('author');

//             //Now to populate author associated with each review we will nest the populate method
//         const camp = await Campground.findById(req.params.id)
//                     .populate({path:'review',
//                      populate:{
//                          path:'author'
//                      }})
//                     .populate('author')
//         if(!camp){
//             req.flash('error','Cannot find the Campground!');
//             return res.redirect('/index');
//         }
//         res.render('./campground/show',{camp:camp});
//     }catch(e)
//     {
//         next(e);
//     }
   
// })
router.get('/:id',wrapAsync(campground.show));

//Handling error for edit, put and delete routes using our wrapAsync function
//EDIT ROUTE
// router.get('/:id/edit',isLoggedIn,wrapAsync(async (req,res)=>{
//     //fetch current camp
//     const camp = await Campground.findById(req.params.id);

//     if(!camp){
//         req.flash('error','Cannot find the Campground!');
//         return res.redirect('/index');
//     }
//     if(camp.author.equals(req.user._id)){
//         res.render('./campground/edit',{camp:camp});
//     }else{
//         req.flash('error',"You don't have permission to do that!");
//         res.redirect(`/index/${req.params.id}`);
//     }
   
// }))
router.get('/:id/edit',isLoggedIn,wrapAsync(campground.edit));


//PUT ROUTE
// router.put('/:id',isLoggedIn,isAuthor,validateSchema,wrapAsync(async (req,res)=>{

//     const camp = req.body.campground;
//     //Update the camp
//         const newCamp = await Campground.findByIdAndUpdate(req.params.id,camp);
//         //redirect to show page
//         req.flash('success','Successfully Updated!')
//         res.redirect(`/index/${newCamp._id}`);

// }))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateSchema,wrapAsync(campground.put));


//DELETE ROUTE

// router.delete('/:id',isLoggedIn,isAuthor,wrapAsync(async (req,res)=>{
//     // const checkCamp = await Campground.findById(req.params.id);
//     // if(checkCamp.author.equals(req.user._id)){
//         await Campground.findByIdAndDelete(req.params.id);
//         req.flash('success','Campground deleted')
//         res.redirect('/index');
//     // }else{
//     //     req.flash('error',"You don't have permission to do that!");
//     //     res.redirect(`/index/${req.params.id}`);
//     // }
    
// }))

router.delete('/:id',isLoggedIn,isAuthor,wrapAsync(campground.delete));

//POST ROUTE
// router.post('/',isLoggedIn,validateSchema,wrapAsync(async (req,res)=>{
//     // //making sure we do not add empty campground
//     // if(!req.body.campground)
//     // {
//     //     throw new errorClass('Invalid Campground Data',400);
//     // }

//     //Using Joi to handle post errors
   

//     const newCampground = req.body.campground;
//     const data = new Campground(newCampground);
//     //adding logged in user id to author section of campground model
//     data.author = req.user._id; //req.user is provided by passport
//     await data.save();
//     //redirect to show page
//     req.flash('success','Sucessfully added new Campground!');
//     res.redirect(`index/${data._id}`);
// }))

router.post('/',isLoggedIn,upload.array('image'),validateSchema,wrapAsync(campground.post));
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files);
//     res.send("It Worked!");
// })

module.exports = router;