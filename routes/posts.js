var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController')


router.post('/', postsController.createPost)

router.get('/:userid/posts', postsController.fetchPosts)

router.post('/:postid/comments', postsController.addComment)

module.exports = router