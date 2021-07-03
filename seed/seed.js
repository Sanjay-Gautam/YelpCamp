const mongoose = require('mongoose');

//Establishing connection
mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Connection open!");
})
.catch((err)=>{
    console.log("Some error!");
    console.log(err);
})

//Requiring Campground Model
const Campground = require('../models/Campground/index');

//Reuiring Cities data
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');

//Function to return a random value from array
const sample = (array)=>{return array[Math.floor(Math.random()*array.length)];}
//Create seed function
const seed = async ()=>{
    //Delete all existing Campgrounds
    await Campground.deleteMany({});
    console.log("All Campgrounds deleted!");
    //Adding 50 Random Camps
    for(let i=0;i<300;i++){
        const p = Math.floor(Math.random()*2000)+1000;
        const random1000 = Math.floor(Math.random()*cities.length);
        const camp = new Campground(
            {
                title: `${sample(descriptors)} ${sample(places)}`,
                price:p,
                description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo fugiat sequi itaque voluptatem. A culpa maxime sed doloribus ex aspernatur impedit, laborum iure asperiores voluptatem nulla, tempore tenetur porro adipisci.',
                author:'5fff2a830c0d3c01bd0b77fa', //Associating each campground with a user names Adam
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                images: [
                    {
                      url: 'https://res.cloudinary.com/dgzilpc8r/image/upload/v1610617760/Yelpcamp/ctnkcvncuyosf5dviax6.jpg',
                      filename: 'Yelpcamp/ctnkcvncuyosf5dviax6'
                    },
                    {
                      url: 'https://res.cloudinary.com/dgzilpc8r/image/upload/v1610617761/Yelpcamp/l7sahddo42sjtu3js2xp.jpg',
                      filename: 'Yelpcamp/l7sahddo42sjtu3js2xp'
                    }
                  ],
                  geometry:{
                      type:'Point',
                      coordinates:[cities[random1000].longitude,cities[random1000].latitude]
                  }
                
            }
        );
        await camp.save();
    }
}


seed().then(()=>{mongoose.connection.close()})
