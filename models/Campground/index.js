const mongoose = require('mongoose');
const Review = require('./review');


//Side note -> To display thumbnail version of image modify image url to have w_size/ just after /upload
    //We will use virtual for that, hence we will create our own image schema

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String
});

//Virtual to have a small sized image 
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_300');
})
const campgroundSchema = new mongoose.Schema(
    {
        title:String,
        images:[imageSchema],
        price:Number,
        description:String,
        location:String,
        //In geometry we will store GeoJSON data that has a specific structure
        geometry:{
            type:{
                type:String,
                enum:['Point'],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
        },
        //Associating a user with a particular campground
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
         review:[{type:mongoose.Schema.Types.ObjectId,ref:'Review'}]
    },{toJSON:{virtuals:true}});


//Add a virtual called properties.popupMarkup so that mapbox features can access properties key to render popup
campgroundSchema.virtual('properties.popupMarkup').get(function(){
    const html = `<a href="/index/${this._id}">${this.title}</a>
                  <p>${this.description.substring(0,30)}....</p>` //30 Charaters long desctiption
                  return html;
})

//+++++++MONGOOSE MIDDLEWARE TO DELETE ASSOCIATED REVIEWS WHEN CAMPGROUND IS DELETED++++++++++
campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({_id:{$in:doc.review}});
    }
})

module.exports = mongoose.model('Campground',campgroundSchema);
