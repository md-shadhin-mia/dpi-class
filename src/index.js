const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { auth } = require("./auth");
const { classRouter } = require("./classroom");
let PORT = 3000 || process.env.PORT;
let MONGODB = "mongodb://localhost:27017/classman" || process.env.MONGODB;

const app = express();

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
app.use("/auth",auth);
app.use("/classroom", classRouter);

app.listen(PORT, ()=>{
    console.log("server lisen on", PORT);
});