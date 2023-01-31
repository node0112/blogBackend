var express = require('express');
var router = express.Router();
//import usermodel
const jwt = require('jsonwebtoken')


//authorize users
router.post('/login',(req,res,next)=>{
    //search user and if user exist then login

    const user = {
        username: req.body.username,
        email: req.body.email,
        posts: "none"
    }

    const accessToken = jwt.sign(user, process.env.TOKEN_SECRET)

    res.json({
        user : user,
        accessToken : accessToken
    })

})

module.exports = router;
