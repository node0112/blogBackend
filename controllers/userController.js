const User = require('../models/UserModel')
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { check, validationResult } = require("express-validator"); //validator
const async = require("async")
const jwt = require("jsonwebtoken")

const TokensModel = require('../models/TokensModel');

exports.create_user = [
    //sanitize input
    check("username")
      .trim()
      .isLength({min: 3})
      .withMessage('Username Should Be At Least 3 Characters')
      .isLength({max: 30})
      .withMessage('Username Must Not Exceed 30 Characters')
      .escape(),

    check("password")
      .trim()
      .isLength({min: 3})
      .withMessage('Password Should Be At Least 3 Characters')
      .isLength({max: 30})
      .withMessage('Password Must Not Exceed 30 Characters')
      .escape(),
    
    check("email")
      .trim()
      .isLength({min: 5})
      .withMessage('Email must not be empty')
      .isEmail()
      .withMessage('Invalid Email')
      .escape(),

      (req, res, next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json(errors)
            return
        }

        User.find({email : req.body.email},(err,user)=>{
          //if user exists then return error

          if(user.length){return res.json({  //checks to see if user exists
            "errors": [
            {
                "value": req.body.email,
                "msg": "User Already Exists, Please Login",
                "param": "email",
                "location": "body"
            }
            ]
           })
          }
          
          //else if fields are valid & no user exists with same email,

          bcrypt.hash(req.body.password, 10, (err,hashedpass)=>{ //hash password
            if(err) return next(err)
            const user = {
              email: req.body.email,
              username: req.body.username,
              password: hashedpass,
            }
            User(user).save(err=>{
              if(err) return next(err)
              return loginUser(user,res) //if stored successfull then login user
            })
          })
        })
    }
]

exports.login_user = [
  check("email")
   .trim()
   .isLength({min: 5})
   .withMessage("Email must not be empty")
   .isEmail()
   .withMessage("Please enter a valid email")
   .escape(),

  check("password")
   .trim()
   .isLength({min: 6})
   .withMessage("Password must be at least 6 characters")
   .escape(),
  
  (req,res,next)=>{
    const errors  = validationResult(req)
    if(!errors.isEmpty()){
      return res.json(errors)
    }
    //find user in database
      User.find({email : req.body.email},async (err,user)=>{
      if(user.length){
        user = user[0] //get first user from array
        if(await bcrypt.compare(req.body.password, user.password)){ //check passowrd after decrypting it
          loginUser(user,res,next) //function to login user and sending tokens
        }
        else res.sendStatus(403)
      }
      else return res.sendStatus(404) //incase the user isn't found
    })
  }
]

function loginUser(user,res,next){
  user = user.toJSON()
  let userEmail = user.email;
  const accessToken = genreateAccessToken(user)
  const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
  TokensModel({user:userEmail, refreshToken: refreshToken, accessToken: accessToken}).save(err =>{
    if(err) return next(err)
    res.json({ //send response if no error
      user : user,
      accessToken : accessToken,
      refreshToken: refreshToken
    })
  })
}


function genreateAccessToken(user){ //generates access tokens
  return jwt.sign(user,process.env.TOKEN_SECRET, {expiresIn : '20s'})
}