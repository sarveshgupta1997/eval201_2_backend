const {UserModel}= require("../models/user.model");
const express=require("express");
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userRoute= express.Router();

//signup
userRoute.post("/signup",async (req,res)=>{
    let {name,email,pass,role}=req.body;
    try {
        bcrypt.hash(pass, 5, async function(err, hash) {
            if(err){
                res.send({err:err.message})
            }else{
                const user = new UserModel({name,email,pass:hash,role});
                await user.save();
                res.send({"msg":"User saved in  db"})
            }
        });
    } catch (error) {
        res.send({err:err.message})
    }
})

//login
userRoute.post("/login",async (req,res)=>{
    let {email,pass}=req.body;
    try {
        let user= await UserModel.findOne({email});
        if(user){
            bcrypt.compare(pass, user.pass, function(err, result) {
                if(err){
                    res.send({err:"Invalid Credentials"})
                }else{                    
                    var token = jwt.sign({ userId:user._id,role:user.role }, 'token',{expiresIn:60});
                    var refreshToken = jwt.sign({ userId:user._id,role:user.role }, 'refreshToken',{expiresIn:60*5});
                    res.cookie("token",token);
                    res.cookie("refreshToken",refreshToken);
                    res.send({"msg":"Login Sucessful",token,refreshToken})
                }
            });
        }else{
            res.send({err:"Invalid Credentials"})
        }
        
    } catch (error) {
        res.send({err:err.message})
    }
})



module.exports={userRoute}