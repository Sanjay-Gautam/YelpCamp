const Review = require('./models/Campground/review');
const Campground = require('./models/Campground/index');
const {errorSchema,schemaReview} = require('./Schemas/validationSchema');
const errorClass = require('./utils/errorClass');

module.exports.isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        
        //Store the url user is requesting in session so that after login we redirect user to that url
        req.session.desiredPath = req.originalUrl; //req.originalUrl is a method that contains the url
        req.flash('error','You must be logged in');
        res.redirect('/login');
    }
    else{
        next();
    }
}
//Middleware to check if the current user is author of the review 
module.exports.isReviewAuthor = async(req,res,next)=>{
    const reviewData = await Review.findById(req.params.rid);
    if(!reviewData.author.equals(req.user._id)){
        req.flash('error',"You don't have the permission!");
        res.redirect(`/index/${req.params.id}`);
    }
    else{
        next();
    }
}

//Middleware to validate Campground
module.exports.validateSchema = function (req,res,next)
{
   
    const {error} = errorSchema.validate(req.body);
     if(error)
     {
         const msg = error.details.map(function(e){return e.message}).join(',');
         throw new errorClass(msg,400)
     }
     else
     {
         next();
     }
    
}
//Middleware to validate Reviews
module.exports.validateSchema2 = function(req,res,next)
{
    const {error} = schemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(function(e){return e.message}).join(',');
        throw new errorClass(msg,400);
    }
    else{
        next();
    }
}

//Middleware to check if the current user is author of the campground 
module.exports.isAuthor = async(req,res,next)=>{
    const checkCamp = await Campground.findById(req.params.id);
    if(!checkCamp.author.equals(req.user._id)){
        req.flash('error',"You don't have the permission!");
        res.redirect(`/index/${req.params.id}`);
    }
    else{
        next();
    }
}
