const express= require('express');
const router= express.Router();
const User= require('../models/user');
const wrapError= require('../validations/WrapError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { session } = require('passport');

router.get('/register', (req, res)=>{
    res.render("./users/register")
}
)

router.post('/register', wrapError(async(req, res)=>{
   try{
    const {username, email, password}= req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password)
   
    req.login(registeredUser, err=>{
        
        
        console.log(registeredUser);
        req.flash('success', 'Welcome to our campground')
        return res.redirect('/campgrounds');
       
    }
    );

    
   }
   catch(e){
    req.flash('error', e.message)
    res.redirect('/register');
   }
}))

router.get('/login', (req, res)=>{
    console.log(req.session.returnTo)
    res.render('./users/login')
    
}
)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req, res)=>{
    //console.log(req.session.returnTo+"**********************");
    console.log(req.session);
    req.flash('success', "Welcome Back")
    console.log(req.session.returnTo)
    res.redirect('/campgrounds');
})

router.post('/logout', (req, res)=>{
    //console.log('********************************************')
    
    req.logout(()=> {
        
    req.flash('success', "Logged you out");
    return res.redirect('/login')
    })
})

module.exports= router;
