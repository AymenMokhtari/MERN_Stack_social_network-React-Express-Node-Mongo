const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose' ) ; 
const passport = require('passport');
const Post = require('../../modules/Post');
const validatePostInput = require ('../../validation/post')


const Profile = require('../../modules/Profile');


// @route Get api/posts
// @desc Get  posts
// @access Public
router.get('/test' , (req , res) => res.json({msg:"Post Works"}) );


// @route Get api/posts/:id
// @desc Get post by id 
// @access Public

router.get('/:id'  , (req , res ) => {
Post.findById(req.params.id)
    .then(post => {
        res.json(post);
    })
    .catch(err => {
        res.status(404).res({nopostfound : 'No post foud with that ID'});
    });

});



// @route Get api/posts/test
// @desc test post route
// @access Public

router.get('/'  , (req , res ) => {
    Post.find()
        .sort( {data:-1})
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(404).res({nopostsfound : 'No posts found'});
        });
    
    });

// @route Post  api/posts
// @desc Create Post
// @access Private
router.post('/' , passport.authenticate('jwt' , {session :false }) , (req, res ) => {

    const {errors , isValid}  = validatePostInput(req.body);
    if(!isValid) {
        res.status(400).json(errors);
        
    }
    const newPost =  new Post( {
        text : req.body.text , 
        name : req.body.name , 
        avatar : req.body.avatar , 
        user : req.user.id


    }) ; 

    newPost.save()
        .then(post => { 
            res.json(post) ;
        })
        .catch(err => {
            res.json({error : err});
        })
        ;
} );


// @route Deltet api/posts/:id
// @desc Delete post
// @access Private
router.delete('/:id' , passport.authenticate('jwt' , {session: false}) , (req, res) => {

        Post.findById(req.params.id)
        .then( post => {
            console.log(post);
                if(post.user.toString() !== req.user.id) {
                    res.status(401).json({notauthorize : 'User not authorised'}) ;
                }

                post.remove()
                    .then(()=> res.json({sucess : true}))
                    .catch(err => {
                        res.json({errror : err});
                    })

        }).catch(err => {
            res.status(404).json({ postnofound  : "Post not found" })
        })


});



// @route Post api/posts/like:id
// @desc Like post
// @access Private
router.post('/like/:id' , passport.authenticate('jwt' , {session: false}) , (req, res) => {

    Post.findById( req.params.id)
    .then( post => {
  
        if(post.likes.filter(like => like.user.toString()  === req.user.id ).length > 0)  {
            return res.status(400).json({alreadyliked: 'Usesr already liked this post'});
        }

        //ad the user id to the lies array 
    
        post.likes.unshift({user : req.user.id}) ; 
        post.save().then(post => res.json(post));
     

    }).catch(err => {
        res.status(404).json({ postnofound  : "Post not found" })
    })


});


// @route Post api/posts/unlike:id
// @desc Unike post
// @access Private
router.post('/unlike/:id' , passport.authenticate('jwt' , {session: false}) , (req, res) => {

    Post.findById( req.params.id)
    .then( post => {
  
        if(post.likes.filter(like => like.user.toString()  === req.user.id ).length === 0)  {


            return res.status(400).json({notliked: 'you have not yet liked this post'});
        }

        //remove the user id to the lies array 
        // get the remove index
        
        const removeIndex = post.likes.map( item => item.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex , 1);

        //Save

        post.save().then(post => res.json(post));
     

    }).catch(err => {
        res.status(404).json({ postnofound  : "Post not found" })
    })


});


// @route Post api/posts/commment:id
// @desc Add a comment
// @access Private




router.post('/comment/:id' , 
    passport.authenticate('jwt' ,{session:false}),
    (req, res ) => {
    
    
    const {errors , isValid}  = validatePostInput(req.body);
    if(!isValid) {
        res.status(400).json(errors);
        
    }


    Post.findById(req.params.id)
        .then(post =>  {
            const newComment = {
                text : req.body.text , 
                name : req.body.name , 
                avatar : req.body.avatar , 
                user: req.user.id
            }
            post.comments.unshift(newComment);

            post.save().then(post => res.json(post)) ;
            
        }).catch(err => res.status(404).json({postnofound  : 'No post Found'}))



});



// @route DELETE api/posts/commment:id/:comment_id
// @desc Remoce comment from post
// @access Private




router.delete('/comment/:id/:comment_id' , 
    passport.authenticate('jwt' ,{session:false}),
    (req, res ) => {
    


    Post.findById(req.params.id)
        .then(post =>  {
         
                // chech if the comment exist

       



                if(post.comments.filter( 
                    comment =>  comment._id.toString() === req.params.comment_id ).length === 0) {
                    
                      return  res.status(404).json({commentnotfoud : "Comment not found"});
                }
                    //Get remove index
                    const removeIndex  = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);

                    post.comments.splice(removeIndex , 1);
                    post.save()
                    .then(post => res.json(post))
                    
                })
                .catch(err => res.status(404).json({postnofound  : 'No post Found'}))



});



module.exports =  router ;