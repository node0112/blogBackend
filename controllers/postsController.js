
const { check, validationResult } = require("express-validator"); //validator
const axios = require('axios') //get axios for external request to facts server

const PostModel = require('../models/PostModel')
const helpers = require("./helpers/tokenHelpers");
const CommentModel = require('../models/CommentModel');
const FactModel = require('../models/FactModel');

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

    check("summary")
    .trim()
    .isLength({min: 10})
    .withMessage('Error, try again later')
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
        let title, date, content, draft, backgroundColor, textColor, author, summary
        const data = req.body
        title = data.title
        date = data.date
        content = data.content
        draft = data.draft
        backgroundColor = data.backgroundColor
        textColor = data.textColor
        author = data.author
        summary = data.summary
        const post = {
            title,
            user: userid,
            author,
            date,
            likes: 0,
            content,
            summary,
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

exports.getUserPosts = async(req,res)=>{
    const user = req.params.userid
    // const posts = await PostModel.find({user: user})
    // if(posts){
    //     res.json({posts})
    // }
    // else res.sendStatus(500)
    PostModel.find({user: user},(err, posts)=>{
        if(err){
            res.sendStatus(500)
        }
        else{
            res.json(posts)
        }
    })
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
     .isLength({min: 3})
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

     check("username")
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
        const username = req.body.username
        const postid = req.params.postid
        const commentForm = {
            post: postid,
            comment: text,
            user: user,
            username,
            date: date,
            likes: 0,
        }
        let comment = new CommentModel(commentForm)
        let commentDb = await comment.save(function (error){
            if(error){ console.log(error) ;return res.sendStatus(500)}
        return res.sendStatus(200)
        })
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
    CommentModel.findById(id).then(resData=>{
        res.sendStatus(200)
    }).catch(err=>{
        res.sendStatus(500)
    })
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


//update posts here
exports.updatePost = [ //post edited post to db after checking for errors
    //very similiar to create post but instead here we just edit the content and other minor details
    //only allow editing in body
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

    check("summary")
    .trim()
    .isLength({min: 10})
    .withMessage('Error, try again later')
    .escape(),

    check("draft")
    .trim()
    .escape(),
    
    async (req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json(errors)
            return
        }
        //add data to req variables and send to database
        const postID = req.params.postid
        let date, content, draft, backgroundColor, textColor, summary
        const data = req.body
        date = data.date
        content = data.content
        draft = data.draft
        backgroundColor = data.backgroundColor
        textColor = data.textColor
        summary = data.summary
        const post = {
            date,
            content,
            summary,
            draft,
            backgroundColor,
            textColor
        }

        PostModel.findByIdAndUpdate(postID , post, (err,updatedDoc)=>{
            if(err) return next(err)
            else{
                res.json({post : updatedDoc})
            }
        })
    }
]

exports.publishPost = async(req,res,next)=>{
    const postid = req.params.postid
    PostModel.findByIdAndUpdate( postid, {draft : false},(err)=>{
        if(err) res.sendStatus(500)
        else{
            res.sendStatus(200)
        }
    })
}

exports.unpublsihPost = async(req,res,next)=>{
    const postid = req.params.postid
    PostModel.findByIdAndUpdate( postid, {draft : true},(err)=>{
        if(err) res.sendStatus(500)
        else{
            res.sendStatus(200)
        }
    })
}

exports.searchPost =[   
    check("search")
    .trim()
    .isLength({min: 5})
    .withMessage("Invalid Search")
    .escape(),
    async (req,res) =>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.json(errors)
            return
        }
        let searchQuery = req.body.search
        console.log(searchQuery)
        let searchResults = await PostModel.find({$text :{$search: searchQuery}, draft: false}) //find post content that matches the given search params
        res.json(searchResults)
    }
]
exports.getFact = async (req,res,next) =>{
    let currentFact = await FactModel.find() //returns array of one fact stored in db along with date
    currentFact = currentFact[0]
    let factDate = currentFact.date
    factDate = new Date(factDate)
    
    factDate = factDate.getDay()
    //if new day then:
    let currDate = new Date()
    let currDay = currDate.getDay() 
    
    if(factDate === 6 && currDay === 0){ //makes sure the fact changes for a new week as day changes to 0
        return getNewFact(res, currDate)
    }
    if(currDay > factDate){   //if the day chagnes, then get a new fact from the api
        getNewFact(res, currDate) 
    }
    else{
        res.json(currentFact)
    }
}

async function getNewFact(res,currDate){ //updates current fact in the database
    const api = axios.create({
        baseURL: "https://api.api-ninjas.com/v1"
    })
    api.get('/facts',{
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': process.env.FACTS_API //get api key from env and set it before the request
        }
    }).then(data =>{
        FactModel.deleteMany({}, err =>{ //after deleting the old fact
            if(err){
                res.sendStatus(500)
            }
            let fact = data.data[0].fact
            const factFormat = {
                fact,
                date : currDate
            }
            FactModel(factFormat).save((err,fact)=>{
                if(err) return res.sendStatus(500)
                return res.send(fact)
            })
            }) //delete all previous facts
    })
    .catch(err =>{
        res.sendStatus(500)
    })
}


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