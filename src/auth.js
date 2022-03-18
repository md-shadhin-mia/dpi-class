const express = require("express");
const jwt = require("jsonwebtoken");
const  mongoose  = require("mongoose");
const { authenticate } = require("./middleware");
const { User } = require("./models/user");
const router = express.Router();

router.get("/", authenticate, async (req, res)=>{
    let user = await User.findById(req.user.id);
    res.json(user);
});

router.post("/login",async (req, res)=>{
    let user =await User.findOne({email: req.body.email, password:req.body.password});
    if(user){
        let token = jwt.sign({id:user._id, email: user.email}, "shhhh");
        res.json({token});
    }else{
        res.status(403).json({error:"email and password not match"});
    }
});

router.post("/register",(req, res)=>{
    let user = new User(req.body);
    user.save()
    .then(result => {
        let token = jwt.sign({id:result._id, email: result.email}, "shhhh");
        res.json({token});
    })
    .catch(error=>{
        res.status(400).json(error);
    })
});

module.exports.auth = router;