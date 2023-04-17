var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController.js')


router.get('/home' , postsController.getPosts) //get posts for showcase in home


module.exports = router
  