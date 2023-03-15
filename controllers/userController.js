const User = require('../models/UserModel')
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { check, validationResult } = require("express-validator"); //validator
const async = require("async")
const jwt = require("jsonwebtoken")

const TokensModel = require('../models/TokensModel');
const helpers = require("./helpers/tokenHelpers")
const isRefreshTokenValid = helpers.isRefreshTokenValid
const generateAccessToken = helpers.generateAccessToken
const generateRefreshToken = helpers.generateRefreshToken


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
  
  async (req,res,next)=>{
    const errors  = validationResult(req)
    if(!errors.isEmpty()){
      return res.json(errors)
    }
    //find user in database
    const userEmail = req.body.email
    let user = await findUser(userEmail) //find user in databse w/ async function
    if(user.length){
      user = user[0] //get first user from array
      if(await bcrypt.compare(req.body.password, user.password)){ //if passwords match
        loginUser(user,res,next) //login user and send tokens
      }
      else res.sendStatus(403)
    }
    else return res.sendStatus(404)
  }
]

exports.createAccessToken = async function (req,res){
  const refreshToken = req.body.refreshToken
  if(refreshToken === null) return res.sendStatus(401)
  const userEmail = req.body.user //used to seach up tokens for the user
  const dbRefreshToken = TokensModel.findOne({user: userEmail})

  if(dbRefreshToken === null){
    return res.sendStatus(401)
  }
  let tokenValid = await isRefreshTokenValid(refreshToken)
  if(tokenValid){
    const accessToken = generateAccessToken(userEmail)
    return res.json({
      accessToken : accessToken
    })
  }

  else return res.sendStatus(403)

}

async function loginUser(user,res,next){
  user = user.toJSON()
  let userEmail = user.email.toString();
  let existingToken = await TokensModel.find({user: userEmail}) //finds token for the user in the database
  const accessToken = await generateAccessToken(userEmail)

  if(existingToken.length > 0){ //if token exists
    let userRes = await createUserRes(userEmail)
    let dbrefreshToken = existingToken[0].refreshToken
    //check if refresh token has expired
    let tokenActive = await isRefreshTokenValid(dbrefreshToken)
    console.log('tokenActive: '+tokenActive)
    if(tokenActive){
      res.json({
        user: userRes,
        refreshToken: dbrefreshToken,
        accessToken
      })
    }

    else{
      let refreshToken = generateRefreshToken(userEmail)
      res.json({
        user : userRes,
        refreshToken,
        accessToken
      })
    }
    //find user from database
  }
  else if(existingToken === null || existingToken.length <= 0){ //creates a new token in the database since it doesn't exist in the database
    const accessToken = generateAccessToken(userEmail)
    const refreshToken = generateRefreshToken(userEmail)
    let userDB = await createUserRes(userEmail)
    let newTokensDB= { //data to store in db
      user: userEmail,
      refreshToken: refreshToken,
    }
    let newTokensRes = { //data to send to user
      user: userDB,
      refreshToken: refreshToken,
      accessToken: accessToken
    }
    TokensModel(newTokensDB).save((err)=>{
      if(err) return next(err)
      return res.json(newTokensRes)
    })
   } //replace existing token
}

async function findUser(userEmail){
  return User.find({email : userEmail})
}

async function createUserRes(userEmail){ //format user to send as a response
  let user = await findUser(userEmail)
  user = user[0]
  user = user.toJSON()
  user = { //manipulate data to send only required fields to the user
    username: user.username,
    email: user.email
  }
  return user
}
