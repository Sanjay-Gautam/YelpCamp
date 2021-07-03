if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
//If we are in development mode than our env key value pairs stored in .env file will be associated with process.env
// console.log(process.env.Secret);

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();
const Joi = require('joi');
const mongooseSanitize = require('express-mongo-sanitize');

const indexRouter = require('./Routes/indexRoutes');
const reviewRouter = require('./Routes/reviewRouter');
const registerRouter = require('./Routes/register');
const loginRouter = require('./Routes/login');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
// const passportMongoose = require('passport-local-mongoose');
const errorClass = require('./utils/errorClass');
const User = require('./models/Campground/user');

//Establishing connection
mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true})
.then(()=>{
    console.log("Connection open!");
})
.catch((err)=>{
    console.log("Some error!");
    console.log(err);
})


app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(session({secret:'thisIsASecretString',resave:false,saveUninitialized:true,cookie:{expires:Date.now()+(1000*60*60*24*7),maxAge:1000*60*60*24*7}}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  //***Make Sure session() is used before this passport.session()***
passport.use(new passportLocal(User.authenticate())); //Telling passport to use local strategy (passport local)  and authentication method is located on User model and is called authenticate
                                                      //We didn't create authenticate by ourselves, it was added by passport-local-mongoose

app.use(mongooseSanitize());

passport.serializeUser(User.serializeUser());     //How to store user in session
passport.deserializeUser(User.deserializeUser()); //How to get user out of the session

//To have access to success,error and current user in all templates use res.locals (global)
app.use((req,res,next)=>{
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    res.locals.currentUser = req.user;  //Passport automatically assignes a user we just need to extract it from req.user
    next();
})


app.use('/index',indexRouter);
app.use('/index/:id',reviewRouter);
app.use('/register',registerRouter);
app.use('/login',loginRouter);

//Serve 'public' directory
app.use(express.static(path.join(__dirname,'public')));


//Home route
app.get('/',(req,res)=>{
    res.render('home');
})

//Route for Logout ==passport provides us req.logout()
app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Come back soon..');
    res.redirect('/index');
})
//Route for 404 error
app.all('*',(req,res,next)=>{
    next(new errorClass("Page not found",404));
})


app.use((err,req,res,next)=>{
   const {status=500, message="Something went wrong"} = err;
   if(!err.message){
       err.message="Oh no, something went wrong!";
   }
   res.status(status).render('errorTemplate',{err:err});
})
app.listen(3000,()=>
{
    console.log("Listening on Port 3000!");
});