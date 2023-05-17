const User = require('../models/UserModel')
const bcrypt = require("bcryptjs")
const passport = require("passport"); // use other forms of auth
const { check, validationResult } = require("express-validator"); //validator
const async = require("async")
const jwt = require("jsonwebtoken")

const PostModel = require('../models/PostModel')
const helpers = require("./helpers/tokenHelpers");
const CommentModel = require('../models/CommentModel');

const isAccessTokenValid = helpers.isAccessTokenValid
const splitAuthToken = helpers.splitAuthToken



exports.createPost = [ //create a post for user
    check("title")
    .trim()
    .isLength({min: 5})
    .withMessage("Title must have at least 5 characters")
    .escape(),
    
    check("backgroundColor")
    .trim()
    .isLength({min: 2})
    .withMessage("Error")
    .escape(),

    check("textColor")
    .trim()
    .isLength({min: 2})
    .withMessage("Error")
    .escape(),

    check("content")
    .trim()
    .isLength({min: 10})
    .withMessage("Please Write A Post")
    .escape(),

    check("author")
    .trim()
    .isLength({min: 3})
    .withMessage("Please Sign In")
    .escape(),

    check("draft")
    .trim()
    .escape(),

    async (req,res,next)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json(errors)
            return
        }
        //add data to req variables and send to database
        let userid =  req.params.userid
        let title, date, content, draft, backgroundColor, textColor, author
        const data = req.body
        title = data.title
        date = data.date
        content = data.content
        draft = data.draft
        backgroundColor = data.backgroundColor
        textColor = data.textColor
        author: data.author
        const post = {
            title,
            user: userid,
            author,
            date,
            likes: 0,
            content,
            draft,
            comments: [{}],
            backgroundColor,
            textColor
        }
        PostModel(post).save((err, newPost)=>{
            if(err) return next(err)
            res.json({
                postId: newPost.id
            })
        })
    }
]

exports.fetchPosts = //fetch posts for user     <------needs testing -------!!!!!
     async (req,res,next)=>{
        // const errors = validationResult(req)  
        const userId = req.params.userid 
        let posts = await PostModel.find({user : userId})
        return res.json({
            posts
        })
    }

exports.getPosts =  async (req,res,next)=>{ 
    let posts = await PostModel.find({draft: false}).limit(10)
    res.json({posts})
}

exports.fetchPost = async (req,res,next)=>{ 
    //get single post from db
    const postid = req.params.postid
    const post = await PostModel.findById(postid)
    return res.json({post})
}

exports.addComment = [ //<----- needs to be completed
    check("comment")
     .trim()
     .isLength({min: 5})
     .withMessage("Comment must have at least 5 characters")
     .escape(),

    check("date")
     .trim()
     .isISO8601()
     .toDate()
     .withMessage("Invalid Date")
     .escape(),
    
     check("user")
     .trim()
     .isLength({min: 3})
     .escape(),


    async (req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.json(errors)
        }
        const date = req.body.date
        const text = req.body.comment
        const user = req.body.user
        const postid = req.params.postid
        const commentForm = {
            post: postid,
            comment: text,
            user: user,
            date: date,
            likes: 0,
        }
        let comment = new CommentModel(commentForm)
        let commentDb = await comment.save(function (error){
            if(error) return res.sendStatus(500)
        })
        return res.json({commentDb})
    }
]

exports.fetchComments = 
    async (req,res,next) => {
    const postid = req.params.postid
    let comments = await CommentModel.find({post: postid})                                                                                                         
    return res.json({comments})
}

exports.upvotePost = async(req,res,next)=>{
    //increase likes by one
    const postid = req.params.postid
    let result = await PostModel.findByIdAndUpdate(postid, {$inc: { likes: 1}})
    res.json({result})
}

exports.downvotePost = async(req,res,next)=>{
    //increase likes by one
    const postid = req.params.postid
    let result = await PostModel.findByIdAndUpdate(postid, {$inc: { likes: -1}})
    res.json({result})
}

exports.upvoteComment = async(req,res,next)=>{
    //increase likes by one
    const id = req.params.commentid
    await CommentModel.findByIdAndUpdate(id, {$inc: { likes: 1}})
    let result = await CommentModel.findById(id)
    res.json({result})
}

exports.downvoteComment = async(req,res,next)=>{
    //increase likes by one
    const id = req.params.commentid
    await CommentModel.findByIdAndUpdate(id, {$inc: { likes: -1}})
    let result = await CommentModel.findById(id)
    res.json({result})
}

exports.getDrafts = async (req,res,next) => {
    const userid = req.params.userid
    //function to find drafts in user's posts

    let draftPosts = await PostModel.find({user: userid, draft: true})
    return res.json({posts : draftPosts, errors:[]})
}

exports.editPost = [ //post edited post to db after checking for errors
    //only allow editing in body
    function(){} //identify and sanitize all the inputs
    ,
    async (req,res,next)=>{
        let post = { 
            //paste default format of all posts here
        }
    }
]

exports.removePost = async(req,res,next)=>{
   //delete post from db using id
    const postid = req.params.postid
    await PostModel.findByIdAndDelete(postid)
    let result = await PostModel.findById(postid)
    let removed
    if(result === null){
        removed = true
    }
    else if(result !== null){
        removed = false
    }
    res.json({
        removed 
    })
}