const express = require("express");
const jwt = require("jsonwebtoken");
const  mongoose  = require("mongoose");
const { authenticate } = require("./middleware");
const { Attendance } = require("./models/attendance");
const { Classroom } = require("./models/classroom");
const { Content } = require("./models/content");
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

//notification

router.get("/notify", authenticate, async (req, res)=>{
    try {
        const classes = await Classroom.find({
            $or:[
                {host:req.user.id},
                {students:req.user.id}
            ]
        });
        let totalClasses = classes.length;
        let totalContent = 0;
        let totalLike = 0;
        for(let i = 0; i < totalClasses; i++){
            let contents =await Content.find({classroom:classes[i]._id.toString()});
            totalContent += contents.length;
            for(let j = 0; j < totalContent; j++){
                totalLike += contents[j].likes.length;
            }
        }
        let count = {tc:totalClasses, tcn: totalContent, tl : totalLike};
        res.json({c:count});
    } catch (error) {
        res.status(400).json(error);
    }
});

//view classroom
router.get("/:id", authenticate, async (req, res)=>{
    try {
        const classrooms = await Classroom.findOne({_id:req.params.id})
        .populate("host", "name").populate("students");
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
        const classroom = await Classroom.findById(req.params.id);
        if(classroom.students.indexOf(req.user.id) < 0)
        {
            classroom.students.push(req.user.id);
        }else{
            classroom.students.pull(req.user.id);
        }
        let result = await classroom.save();
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

//contents
router.get("/content/:id", authenticate, (req, res)=>{
    Content.find({classroom:req.params.id}).sort({createdAt:-1}).limit(10).populate("user").populate("likes")
    .then(result => {
        res.json(result);
    })
    .catch(error=>{
        res.status(404).json(error);
    });
});

router.post("/content/:id", authenticate, (req, res)=>{
    const content = new Content({
        text:req.body.text,
        user:req.user.id,
        classroom:req.params.id
    });
    content.save()
    .then(result => {
        res.json(result);
    })
    .catch(error=>{
        res.status(400).json(error);
    });
});

router.get("/content/like/:id", authenticate, async (req, res)=>{
    try {
        const content = await Content.findById(req.params.id);
        if(content.likes.indexOf(req.user.id) < 0)
        {
            content.likes.push(req.user.id);
        }else{
            content.likes.pull(req.user.id);
        }
        let result = await content.save();
        await result.populate("user");
        await result.populate("likes");
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});


//attendance 

router.get("/attendance/:id", authenticate, async (req, res)=>{
    try {
        const attendaces =await Attendance.find({classroom:req.params.id}).populate("host").populate("present");
        res.json({attendaces, current_time: Date.now()});
    } catch (error) {
        res.status(400).json(error);
    }
});
router.post("/attendance/:id",  authenticate, (req, res)=>{
    const attendace = new Attendance({
        classroom: req.params.id,
        host: req.user.id,
        end_session : (Date.now()+(req.body.end_session*1000)).toString()
    });
    attendace.save()
    .then(result => {
        res.json(result);
    })
    .catch(error=>{
        res.status(400).json(error);
    });
});

module.exports.classRouter = router;