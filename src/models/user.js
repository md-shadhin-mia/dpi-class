const mongoose = require("mongoose");

const userSchema =new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, select: false, required: true},
    profileurl: String,
}) 

userSchema.path("email").validate(async (value)=>{
    const emailcount = await this.User.count({email:value});
    return !emailcount;
}, "Email alredy exists");
module.exports.User = mongoose.model('User', userSchema);