const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { diskStorage } = require("multer");
const { extname } = require("path");
const path = require("path");
const { auth } = require("./auth");
const { classRouter } = require("./classroom");
const { authenticate } = require("./middleware");
const { User } = require("./models/user");
const cors = require("cors");
let PORT = process.env.PORT || 3000;
let MONGODB = process.env.MONGODB || "mongodb://localhost:27017/classman";
const app = express();
app.use(cors())
const storage = diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/files')
    },
    filename:(req, file, cb)=>{
        const fileName = Date.now()+(Math.random()*1e9 | 0)+"_"+file.originalname;
        req.fileurl = "/files/"+fileName;
        cb(null, fileName);
    }
});

const upload = multer({storage: storage});
//connect to database
mongoose.connect(MONGODB);


//static hosting
app.use(express.static("./public"))

//parses incoming request to request body
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/join/:id", (req, res)=>{
    res.sendFile(path.join(__dirname, "../public/index.html"));
})
app.use("/auth", auth);
app.use("/classroom", classRouter);
//oupload profile
app.post("/profile", authenticate , upload.single('profile'), async (req, res)=>{
    const user =await User.findById(req.user.id);
    
    // user.profileurl = req.fileurl;
    user.updateOne({profileurl:req.fileurl})
    .then(result=>{
        res.json(result);
    })
    .catch(error=>{
        res.status(400).json(error);
    })
});
app.listen(PORT, ()=>{
    console.log("server lisen on", PORT);
});