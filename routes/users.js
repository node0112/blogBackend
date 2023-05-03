var express = require('express');
var router = express.Router();

const postsController = require('../controllers/postsController')
const userController = require('../controllers/userController')


//get posts for user or create a post for user

router.get('/:userid/posts', postsController.fetchPosts) // get all posts for user [working]

router.get('/:userid/drafts', postsController.getDrafts) // fetch drafts [working]

router.get('/:userid', userController.getUserInfo) 





module.exports = router;