var jwt = require('jsonwebtoken');
const fs = require("fs")

const authenticator= (req,res,next)=>{
    let token = req.cookies.token;
    let  refreshToken = req.cookies.refreshToken;

    if(token){
        var blackListedTokens= JSON.parse(fs.readFileSync("./blackListedTokens.json","utf-8"));
        if(blackListedTokens.includes(token)){
            res.send({err:"Please Login Again"})
        }else{
            var decoded = jwt.verify(token, 'token', function(err, decoded) {
                if(err){
                    res.send({msg:"Please Login Again",err:err.message})
                }else{
                    req.body.userId=decoded.userId;
                    req.body.role=decoded.role;
                    next();
                }
            });
        }
    }else{
        res.send({err:"Please Login Again"})
    }
}

module.exports={authenticator}