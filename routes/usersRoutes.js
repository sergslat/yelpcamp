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

router.post('/register', catchAsync (async (req,res) => {
    try{

    
    const{email,username,password} = req.body;
    const user = new User ({email,username})
    const registeredUser= await User.register(user,password);
    req.flash('success','Welcome to YelpCamp!!')
    res.redirect('/campgrounds')
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register')

    }
    // console.log(registeredUser);
    
}));

router.get('/login', (req,res) =>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:true}), (req,res) => {
  
    // const {username}=req.body;  
    // req.flash('success', `Welcome back ${username}!`)
    res.redirect('/campgrounds')
  
  
})

module.exports = router;