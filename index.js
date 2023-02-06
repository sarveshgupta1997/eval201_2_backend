const express=require("express");
const mongoose=require("mongoose");
const {userRoute}=require("./routes/user.route");
const {authenticator}=require("./middlewares/authenticator");
const {authoriser}=require("./middlewares/authoriser");
require("dotenv").config();
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const fs = require("fs");

const connection=require("./config/db")

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use("/users",userRoute);


// goldrate
app.get("/goldrate",authenticator,(req,res)=>{
    res.send({"msg":"Today's Goldrate is ₹59000/10gm"})
})

// refreshToken
app.get("/newToken",(req,res)=>{
    let refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        var decoded = jwt.verify(refreshToken, 'refreshToken', function(err, decoded) {
            if(err){
                res.send({msg:"Please Login Again",err:err.message})
            }else{
                var token = jwt.sign({ userId:decoded._id,role:decoded.role }, 'token',{expiresIn:60});
                res.cookie("token",token);
                res.send({"msg":"Login Sucessful",token})
            }
        });
    }else{
        res.send({err:"Please Login Again"})
    }
})

// logout
app.get("/logout",authenticator,(req,res)=>{
    let token = req.cookies.token;
    var blackListedTokens = JSON.parse(fs.readFileSync("./blackListedTokens.json","utf-8"));
    blackListedTokens.push(token);
    fs.writeFileSync("./blackListedTokens.json",JSON.stringify(blackListedTokens))
    res.send({"msg":"Logged Out"})
})

// userstats
app.get("/userstats",authenticator,authoriser(["manager"]),(req,res)=>{
    res.send({"msg":"Here are User Stats- As you are a manager, onlt you can see this."})
})




app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log("connected to db");
    } catch (error) {
        console.log({err:error.message})
    }
    console.log("server running")
})