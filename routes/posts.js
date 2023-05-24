var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController.js')



router.post('/:postid/comment', postsController.addComment) // add comment to post

router.get('/:postid/comments', postsController.fetchComments) //get comments for post

router.post('/:userid/post', postsController.createPost) // create post for specified user [needs completion in controller]

//--------------------===== test routes below ====----------------------------->

router.get('/:postid', postsController.fetchPost) // get specific post [working ]

router.post('/:postid/upvote', postsController.upvotePost) //upvote a post [working]

router.post('/:postid/downvote', postsController.downvotePost) //upvote a post  [working]

router.post('/comment/:commentid/upvote', postsController.upvoteComment) // add comment to post [works]

router.post('/comment/:commentid/downvote', postsController.downvoteComment) // add comment to post [works]

router.post('/:postid/edit', postsController.updatePost) //send updated post to database

router.post('/:postid/publish', postsController.publishPost) //publish post by setting draft mode to false

router.post('/:postid/unpublish', postsController.unpublsihPost) //publish post by setting draft mode to true

router.post('/:postid/remove', postsController.removePost) //remove post from db [works]


module.exports = router
