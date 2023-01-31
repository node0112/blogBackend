var express = require('express');
var router = express.Router();
//require postmodel
/* GET users listing. */


//sample posts
let posts = [
  {
    email: 'spectreharvey@gmail.com',
    title: 'a new way to write node',
    date: new Date()
  },
  {
    email: 'joemama@gmail.com',
    title: 'a new way to write node',
    date: new Date()
  },
  {
    email: 'dextermorgan@gmail.com',
    title: 'a new way to write node',
    date: new Date()
  },
  {
    email: 'dextermorgan@gmail.com',
    title: 'a new way to write node',
    date: new Date()
  }
]

router.get('/posts', function(req, res, next) {
  const user = req.user
  res.json(posts.filter(post => post.email ===  user.email)); //only returns users post
});

module.exports = router;
