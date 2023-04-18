var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken')
var mongoose = require("mongoose") 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts')

require('dotenv').config()


var app = express();

app.use(cors)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);
app.use('/user', usersRouter);
app.use( '/post',authToken,postsRouter)

//connect to mongoDB
const mongoDB = process.env.MONGODB_URI ;
const helpers = require('./controllers/helpers/tokenHelpers')


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//authorize token
async function authToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = helpers.splitAuthToken(authHeader) ; //if header exists then split it and get token
  if(token == null) return res.sendStatus(404) //send to signup page
  jwt.verify(token,process.env.TOKEN_SECRET,(err)=>{
    if(err){
        res.sendStatus(403)
    }
    else{
        next()
    }
  })
}

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


app.listen("3000")


module.exports = app;

