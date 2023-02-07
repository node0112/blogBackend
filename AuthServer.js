var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken')
var mongoose = require("mongoose") 


const usersController = require('./controllers/userController')



require('dotenv').config()

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//handle all authentication and token generation from this server


//--connect to database

const mongoDB = process.env.MONGODB_URI ;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//---------



//Sample Users DB
let usersModel = [
    {
        username: 'test',
        email: "joemama@gmail.com",
        posts: "none"
    },
    {
        username: 'siddiboi',
        email: "spectreharvey@gmail.com",
        posts: "4"
    },
    {
        username: 'dexter',
        email: "dextermorgan@gmail.com",
        posts: "10"
    },

]


app.post('/auth/login', usersController.login_user)


app.post('/auth/signup', usersController.create_user)

app.post('/auth/token', (req,res)=>{
    const refreshToken = req.headers.token
    if(refreshToken === null ) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403) //check if token is in database

    //if it passes all checks then 
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err, user)=>{
        if(err) return res.sendStatus(403)
        const accessToken = genreateAccessToken({name: user.email})
        res.json({accessToken})
    })
})

app.delete('/auth/logout', (req,res)=>{
    //delete from database
    refreshTokens = refreshTokens.filter(token => token !== req.headers.token) //delete from db
    console.log(refreshTokens)
    res.sendStatus(204)
})

let refreshTokens = [] //emulate tokens stored in db



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(4000)


module.exports = app;
