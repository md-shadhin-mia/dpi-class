const mongoose = require("mongoose");

const classRoomSchema =new mongoose.Schema({
    title: {type:String, required:true},
    description: String,
    host: {type:mongoose.Types.ObjectId, required:true, ref:"User"},
    students:[{type:mongoose.Types.ObjectId, ref:"User"}]
}, {timestamps:true});

module.exports.Classroom = mongoose.model('Classroom', classRoomSchema);