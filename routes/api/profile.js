const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');



//Load profile module 

const Profile = require('../../modules/Profile');
//Load user Profie
const User = require('../../modules/User');
const validateProfileInput = require('../../validation/profile');
const validatExperienceInput = require('../../validation/experience')
const validatEducationInput = require('../../validation/education.js')





// @route Get api/profile/test
// @desc profile post route
// @access Public
router.get('/test' , (req , res) => res.json({msg:"Profile Works"}) );




// @route Get api/profile
// @desc Get curretn users profile 
// @access private


router.get('/' , passport.authenticate('jwt' , {session : false }) , (req , res) => {
const errors = {} ;

    Profile.findOne({user : req.user.id })
        .populate('user' , ['name' ,'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no porfile for this user' ; 
            return res.status(404).json(errors);
        }
        res.json(profile);
        })
        .catch(err => res.status(404).json(err));

});

// @route Post api/user/:user_id
// @desc Get Profile by user id
// @access Public
router.get ('/user/:user_id' ,(req,res)=> {
    const errors = {};
Profile.findOne({user : req.params.user_id})
    .populate('user' , ['name' , 'avatar'])
    .then(profile=> {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }

        res.json(profile);


    }).catch(err =>  res.status(404).json( {profile : 'there is no profile for this user'}));
});




// @route Post api/profile/all
// @desc Get all profiles
// @access Public

router.get('/all' , (req , res)=> {
const errors = {};
Profile.find()
        .populate('user' , ['name' , 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = 'There are no profiles'
                return res.status(404).json(errors);
            }

            res.json(profiles);

        }).catch(err => {
            return res.status(404).json("there are no profiles");
        })

});


// @route Post api/handle/:handle
// @desc Get Profile by handle
// @access Public
router.get ('/handle/:handle' ,(req,res)=> {
    const errors = {};
Profile.findOne({handle : req.params.handle})
    .populate('user' , ['name' , 'avatar'])
    .then(profile=> {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }

        res.json(profile);


    }).catch(err =>  res.status(404).json({handle : 'there is no profile for this user'}));
});



// @route Post api/profile/
// @desc Get create or update user profile 
// @access private


router.post('/' , passport.authenticate('jwt' , {session : false }) , 

    (req , res) => {
        const {errors, isValid } = validateProfileInput(req.body);

        //checkk calidationo 
        if(!isValid)  {
            //return any errors with 400 status 

            return  res.status(400).json(errors);
        }

    // Get fileds 
    
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle ;
    if(req.body.company) profileFields.company = req.body.company ;
    if(req.body.website) profileFields.website = req.body.website ;
    if(req.body.location) profileFields.location = req.body.location ;
    if(req.body.bio) profileFields.bio = req.body.bio ;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername ;

    //Skills - Split into array 

    if(typeof req.body.skills != 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};

    if(req.body.youtube) profileFields.social.youtube = req.body.youtube ;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter ;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook ;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin ;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram ;
 
    Profile.findOne({user : req.user.id})
        .then(profile => {
            if(profile) {
                Profile.findOneAndUpdate({ user : req.user.id}  ,{$set : profileFields} , {new :true})
                .then( profile => { res.json(profile)})
            }else {
                //Create 

                //Check if handle exists

                Profile.findOne({handle : profileFields.handle}).then(profile=>  {
                    if(profile) {
                        errors.handle = 'That handle already exists';

                        res.status(400).json(errors);
                    }

                    //save Profile
                    new Profile(profileFields).save().then(profile => res.json(profile))
                });
            }



        });
    
    });
// @route Post api/profile/experionce
// @desc Add experience to profile
// @access private
router.post('/experience' , passport.authenticate('jwt' , {session : false} ) , (req , res ) => {

    const {errors, isValid } = validatExperienceInput(req.body);

    //checkk calidationo 
    if(!isValid)  {
        //return any errors with 400 status 

        return  res.status(400).json(errors);
    }

    Profile.findOne( {user : req.user.id})
    .then(profile => {
        const newExp = {
            tite:req.body.tite  , 
            company : req.body.company , 
            location : req.body.location , 
            from : req.body.from , 
            to :req.body.to , 
            current : req.body.current , 
            description :req.body.description 
        }

        profile.experience.unshift(newExp);
        profile.save()
        .then(profile=> {
                res.json(profile)

        });
    });

});



// @route Post api/profile/education
// @desc Add education to profile
// @access private
router.post('/education' , passport.authenticate('jwt' , {session : false} ) , (req , res ) => {

    const {errors, isValid } = validatEducationInput(req.body);

    //checkk calidationo 
    if(!isValid)  {
        //return any errors with 400 status 

        return  res.status(400).json(errors);
    }

    Profile.findOne( {user : req.user.id})
    .then(profile => {
        const newEdu = {
            school:req.body.school  , 
            degree : req.body.degree , 
            fieldofstudy : req.body.fieldofstudy , 
            from : req.body.from , 
            to :req.body.to , 
            current : req.body.current , 
            description :req.body.description 
        }

        profile.education.push(newEdu);
        profile.save()
        .then(profile=> {
                res.json(profile)

        });
    });

});
    

    
// @route Delete api/profile/experience/:id
// @desc Delte experience from  profile
// @access private
router.delete('/experience/:exp_id' , passport.authenticate('jwt' , {session : false} ) , (req , res ) => {

  
    Profile.findOne( {user : req.user.id})
    .then(profile => {
        // Get remove index 
        const removeIndex = profile.experience
            .map( item => { item.id})
            .indexOf(req.params.exp_id);

            //split out of array 
            profile.experience.splice(removeIndex , 1) ;

            profile.save().then(profile => res.json(profile));
 

    }).catch(err => res.status(404).json(err));

    

});
    

// @route Delete api/profile/education/:edu_id
// @desc Delte education from  profile
// @access private
router.delete('/education/:edu_id' , passport.authenticate('jwt' , {session : false} ) , (req , res ) => {

  
    Profile.findOne( {user : req.user.id})
    .then(profile => {
        // Get remove index 
        const removeIndex = profile.education
            .map( item => { item.id})
            .indexOf(req.params.edu_id);

            //split out of array 
            profile.education.splice(removeIndex , 1) ;

            profile.save().then(profile => res.json(profile));
 

    }).catch(err => res.status(404).json(err));




    

});
    
// @route Delete api/profile
// @desc delete  user and profile
// @access private
router.delete('/' , passport.authenticate('jwt' , {session : false} ) , (req , res ) => {
    console.log('delete');

    Profile.findOneAndRemove({user : req.user.id})
        .then (() => {
            User.findOneAndRemove({_id : req.user.id}) 
                .then(()=> res.json({success : true}))
        });
    

});
    


module.exports = router;