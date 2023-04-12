var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController')

/* GET home page. */
router.get('/' , postsController.getPosts) //get posts for showcase in home


module.exports = router;
  