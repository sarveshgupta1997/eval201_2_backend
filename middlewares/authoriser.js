var jwt = require('jsonwebtoken');
const fs = require("fs")

const authoriser= (roleArray)=>{
    return(req,res,next)=>{
        let role=req.body.role;
        if(roleArray.includes(role)){
            next();
        }else{
            res.send({err:"Protected Route: You are not authorized"})
        }
    }
}

module.exports={authoriser}