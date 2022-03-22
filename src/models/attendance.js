const mongoose = require("mongoose");

const attendanceSchema =new mongoose.Schema({
    classroom: {type:mongoose.Types.ObjectId, required:true, ref:"Classroom"},
    host: {type:mongoose.Types.ObjectId, required:true, ref:"User"},
    present:[{type:mongoose.Types.ObjectId, ref:"User"}],
    end_session:{type:String, required:true}
}, {timestamps:true});

module.exports.Attendance = mongoose.model('attendance', attendanceSchema);