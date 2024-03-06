const express = require("express")
const cors= require("cors")
 require("dotenv").config()
const mongoose = require("mongoose") // to create db, retrieve data
const app = express() //object to use express
const userRoute = require("./Routes/userRoute")
const chatRoute= require("./Routes/chatRoute")
const messageRoute = require("./Routes/messageRoute")


app.use(express.json()) //to work with incoming json requests
app.use(cors()) //cross origin request sharing
app.use("/api/users", userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);

//CRUD = app.post(), app.get(), app.put(), app.delete()

app.get("/",(req, res)=>{
    res.send("Welcome to our chat app API")
});

// to create tables- > models

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res)=>{
    console.log(`server running on : ${port}`)
});


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("mongoDb connection established")).catch((error)=> console.log("MongoDb connection failed:", error.message));