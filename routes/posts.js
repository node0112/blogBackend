var express = require('express');
var router = express.Router();
const postsController = require('../controllers/postsController')

let posts = [
    {
        title: 'A new Way of Life With MacOS',
        description: 'Lala Land',
        author: 'dextermorgan@gmail.com'
    },
    {
        title: 'When People Use Windows For Programming',
        description: 'Windows in known to be antiproductive as compared to Linux and MacOS',
        author: 'dextermorgan@gmail.com'
    },
    {
        title: 'Is Firebase Making Venor Lock Ins',
        description: 'HEHEH',
        author: 'specterharvey@gmail.com'
    },
]

router.use('/post',(req,res,next)=>{ //create a post
    console.log(req.body.post)
    posts.push(req.body.post)
    res.json(posts[posts.length-1])
})

router.post('/authTest',
    postsController.fetchPosts
)

  
router.get('/posts', function(req, res, next) { // get all posts for that user
const user = req.user
res.json(posts.filter(post => post.email ===  user.email)); //only returns users post
});

module.exports = router