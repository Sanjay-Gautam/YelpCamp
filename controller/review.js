const Campground = require('../models/Campground/index');
const Review  = require('../models/Campground/review');

module.exports.post = async(req,res)=>{

    const camp = await Campground.findById(req.params.id);
    const reviewData = new Review(req.body.review);
    reviewData.author = req.user._id;
    camp.review.push(reviewData);
    await reviewData.save();
    await camp.save();
    req.flash('success',"Created new review")
    res.redirect(`/index/${req.params.id}`);
}

module.exports.delete = async(req,res)=>{
    const {id,rid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:rid}});
    await Review.findByIdAndDelete(rid);
    req.flash('success','Review Deleted!');
    res.redirect(`/index/${id}`);
}