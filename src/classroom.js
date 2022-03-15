const express = require("express");
const jwt = require("jsonwebtoken");
const  mongoose  = require("mongoose");
const { authenticate } = require("./middleware");
const { Classroom } = require("./models/classroom");
const router = express.Router();


//view classrooms
router.get("/", authenticate,async (req, res)=>{
    const classrooms = await Classroom.find({
        $or:[
            {host:req.user.id},
            {students:req.user.id}
        ]
    })
    .populate("host", "name");
    res.json(classrooms);
});
//view classroom
router.get("/:id", authenticate, async (req, res)=>{
    try {
        const classrooms = await Classroom.findOne({_id:req.params.id})
        .populate("host", "name");
        res.json(classrooms);
    } catch (error) {
        res.status(400).json(error);
    }
});
//new classroom
router.post("/", authenticate, (req, res)=>{
    const classroom = new Classroom({
        title:req.body.title,
        description:req.body.description, 
        host:req.user.id
    });
    classroom.students = [req.user.id]
    classroom.save()
    .then(result => {
        res.json(result);
    })
    .catch(error=>{
        res.status(400).json(error);
    });
});
//join to classroom
router.get("/join/:id", authenticate, async (req, res)=>{
    try {
        const classroom = await Classroom.findOne({_id:req.params.id});
        classroom.students = [...classroom.students, req.user.id]
        let result = await classroom.save();
        console.log(classroom.students);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports.classRouter = router;