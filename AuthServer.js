var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const jwt = require('jsonwebtoken')
var mongoose = require("mongoose") 


const usersController = require('./controllers/userController')



require('dotenv').config()

var app = express();

app.use(cors())


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



app.post('/auth/login', usersController.login_user)


app.post('/auth/signup', usersController.create_user)

app.post('/auth/accessToken', usersController.createAccessToken)


app.post('/auth/logout', (req,res)=>{
    //delete from database
    refreshTokens = refreshTokens.filter(token => token !== req.headers.token) //delete from db
    console.log(refreshTokens)
    res.sendStatus(204)
})




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
