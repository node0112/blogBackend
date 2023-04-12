var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController.js')



router.post('/:postid/comment', postsController.addComment) // add comment to post

router.get('/:postid/comments', postsController.fetchComments) //get comments for post

//--------------------===== test routes below ====----------------------------->

router.get('/:postid', postsController.fetchPost) // get specific post [working ]

router.post('/:postid/upvote', postsController.upvotePost) //upvote a post [working]

router.post('/:postid/downvote', postsController.downvotePost) //upvote a post  [working]

router.post('/:postid/comment/upvote', postsController.upvoteComment) // add comment to post

router.post('/:postid/comment/downvote', postsController.downvoteComment) // add comment to post

router.get('/:postid/edit', postsController.fetchPost) //fetch post to edit 

router.post('/:postid/edit', postsController.editPost) //send updated post to database

router.post('/:postid/remove', postsController.removePost) //remove post from db



module.exports = router