
const User = require('../models/Campground/user');

module.exports.new = (req,res)=>{
    
    res.render('./user/newUser');
}

module.exports.post = async(req,res,next)=>{
    try{
        const { username, email, password  } = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to Yelpcamp');
            res.redirect('/index');
         })
        
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}