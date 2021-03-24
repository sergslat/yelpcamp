// const ExpressError=require('../utils/ExpressError')
const catchAsync = require ('../utils/catchAsync');

// const mongoose = require('mongoose');

const User = require('../models/user')
const express = require ('express');
const passport =  require('passport');
const app=express();
const router = express.Router();
// const methodOverride= require('method-override')
// app.use(methodOverride('_method'))

router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', catchAsync (async (req,res,next) => {
    try{

    
    const{email,username,password} = req.body;
    const user = new User ({email,username})
    const registeredUser= await User.register(user,password);

    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success','Welcome to YelpCamp!!')
        res.redirect('/campgrounds')
    })
   
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register')

    }
    // console.log(registeredUser);
    
}));

router.get('/login', (req,res) =>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res) => {
  
    const {username}=req.body;  
    req.flash('success', `Welcome back ${username}!`)
    const redirectUrl = req.session.returnTo || '/' 
    res.redirect(redirectUrl)
  
  
})

router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success','Goodbye!!')
    res.redirect('/');
})
module.exports = router;