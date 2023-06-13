var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController.js')



router.post('/:postid/comment', postsController.addComment) // add comment to post

router.get('/:postid/comments', postsController.fetchComments) //get comments for post

router.post('/:userid/post', postsController.createPost) // create post for specified user [needs completion in controller]

router.get('/:userid/userposts', postsController.getUserPosts)

router.get('/:postid', postsController.fetchPost) // get specific post 

router.post('/:postid/upvote', postsController.upvotePost) //upvote a post 

router.post('/:postid/downvote', postsController.downvotePost) //upvote a post  

router.post('/comment/:commentid/upvote', postsController.upvoteComment) // add comment to post

router.post('/comment/:commentid/downvote', postsController.downvoteComment) // add comment to post

router.post('/:postid/edit', postsController.updatePost) //send updated post to database

router.post('/:postid/publish', postsController.publishPost) //publish post by setting draft mode to false

router.post('/:postid/unpublish', postsController.unpublsihPost) //publish post by setting draft mode to true

router.post('/:postid/remove', postsController.removePost) //remove post from db

router.post('/search', postsController.searchPost) //search using the content field



module.exports = router
