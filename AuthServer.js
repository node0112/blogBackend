var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken')



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

//app.use( '/post')


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


app.post('/auth/login',(req,res,next)=>{
    //search user and if user exist then login
    let dbUser = usersModel.filter(dbUser => dbUser.email === req.body.email)
    dbUser = dbUser[0]
    if(dbUser !== null)  loginUser(dbUser,res,req)
    else res.sendStatus(403)
})

function loginUser(dbUser,res,req){
    console.log(dbUser.email)

    const user = { //find user from db
        username: dbUser.username,
        email: dbUser.email,
        posts: dbUser.posts
    }
    const accessToken = genreateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    res.json({
        user : user,
        accessToken : accessToken,
        refreshToken: refreshToken
    })
}


function genreateAccessToken(user){
    return jwt.sign(user,process.env.TOKEN_SECRET, {expiresIn : '60s'})
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

app.listen(4000)


module.exports = app;
