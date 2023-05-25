var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController.js')


router.get('/home' , postsController.getPosts) //get posts for showcase in home

router.get('/fact' , postsController.getFact) //get a fact for sidebar on home



module.exports = router
  