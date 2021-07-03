const mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');

userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(passportMongoose) //This will add field for username and password to our schema and make sure those names are unique
                                    //This also adds some additional methods to our schema

const User = mongoose.model('User',userSchema);
module.exports = User;
