const jwt = require("jsonwebtoken")

exports.isAccessTokenValid = async function(token){
    return jwt.verify(token,process.env.TOKEN_SECRET,(err,tokenStat)=>{
        if(err){
            return false
        }
        else{
            return true
        }
    })
}
exports.isRefreshTokenValid = async function(token){
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err,tokenStat)=>{
        if(err){
            return false
        }
        else{
            return true
        }
    })
}


exports.splitAuthToken = function(authHeader){
    const token= authHeader && authHeader.split(' ')[1]
    return token
}

exports.generateAccessToken= function (userEmail){ //generates access tokens and saves them in db
    const token = jwt.sign({user: userEmail}, process.env.TOKEN_SECRET, {expiresIn : "20m"})
    return token
}

exports.generateRefreshToken = function (userEmail){
    const token = jwt.sign({user: userEmail}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
    return token
}