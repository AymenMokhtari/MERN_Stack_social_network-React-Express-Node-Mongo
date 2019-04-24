const express = require('express');
const router  = express.Router();
const gravatar = require('gravatar');
//Loac user model 
const User  = require('../../modules/User')
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const keys  = require('../../config/keys');

const passport = require('passport');
//Load input validation 
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')



// @route Get api/users/test
// @desc profile users route
// @access Public

router.get('/test' , (req , res) => res.json({msg:"Users Works"}) );

// @route Post api/users/register
// @desc Register user
// @access Public

router.post('/register' , (req , res ) =>  {


    const {errors , isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({email : req.body.email})
    .then(user => {
        errors.email = 'Email already exists';

        if(user) {
            return res.status(400).json(errors);
        }else {
            const avatar = gravatar.url(req.body.email , {
                s:'200' , 
                r:'pg' ,
                d: 'mm'

            })
            const newUser = new User( {
                name :req.body.name,
                email : req.body.email,
                avatar, 
                password  : req.body.password

            });
            newUser
            .save()
            bcrypt.genSalt(10 , (err , salt)=> {
                bcrypt.hash(newUser.password , salt , (err , hash)=> {
                    if(err) throw err ; 
                    newUser.password = hash ;
                    newUser
                    .save()
                    .then(user => res.json(user) )
                    .catch(err => console.log(err));
                });

            });

        }
    });

});
// @route Post api/users/login
// @desc Login user /Returning JWT Token
// @access Public


router.post('/login' , (req , res)=> {

    const  {errors , isValid} = validateLoginInput(req.body);

    const email = req.body.email ; 
    const password = req.body.password ; 

    if(!isValid) {
        return res.status(404).json(errors);
    }

    //Find user By email 


    User.findOne({email}).
        then(user=> {
            // Check for user 

            if(!user ) {
                errors.email= 'User not found';
                return res.status(404).json(errors);
            } 

            //Check Password
            bcrypt.compare(password , user.password)
                .then(isMath => {

                    if(isMath) {
                           // user matched
                            const payload = { id:user.id  , name:user.name , avatar:user.avatar} // create jwt payload
                           //sign Token
                           jwt.sign(payload ,keys.secret, {expiresIn :3600 }  ,(err , tocken) => {
                                res.json({
                                    success:  true , 
                                    token : 'Bearer '+tocken
                                })
                                
                           }) ;
                    }else {
                        errors.password = 'Password incorrect' ;
                        return res.status(400).json(errors);

                    }
                })

        })
});



// @route Get api/users/current
// @desc Return current user
// @access private
router.get('/current', passport.authenticate('jwt' , {session:false}) , (req , res) => {
    res.json({
        id:req.user.id , 
        name : req.user.name,
        email : req.user.email, 
        body : req.body 
    });
})




module.exports = router;