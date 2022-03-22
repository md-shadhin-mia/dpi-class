const mongoose = require("mongoose");

const ContentSchema =new mongoose.Schema({
    text: {type:String, required:true},
    user:{type:mongoose.Types.ObjectId, required:true, ref:"User"},
    classroom:{type:mongoose.Types.ObjectId, required:true, ref:"Classroom"},
    likes:[{type:mongoose.Types.ObjectId, ref:"User"}]
}, {timestamps:true});

module.exports.Content = mongoose.model('Content', ContentSchema);