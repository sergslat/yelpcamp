const ExpressError=require('../utils/ExpressError')
const catchAsync = require ('../utils/catchAsync');

const mongoose = require('mongoose');

const Campground = require('../models/campground')
const express = require ('express');
const app=express();
const router = express.Router();
const {campgroundSchema} = require('../schemas');
const methodOverride= require('method-override')
app.use(methodOverride('_method'))

const validateCampground = (req,res,next) => {

    const {error}=campgroundSchema.validate(req.body);
    
    if(error){

        const msg = error.details.map (el => el.message).join (',')
        throw new ExpressError (msg, 400)
        
    } else {
        next();
    }
}

router.get('/new',  (req,res) =>{ 

    
    res.render('campgrounds/new')
    
}) 

router.get('/', catchAsync(async (req,res) =>{ 

    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
    
})) 

router.post('/', validateCampground, catchAsync(async (req,res,next) =>{ 

   

    const campground = new Campground (req.body)
    await campground.save();
    req.flash('success','Succesfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
    
    // res.send(req.body);
    // console.log(req.body);
    
})) 

router.get('/:id',  catchAsync(async (req,res) =>{ 

    const {id}=req.params;
    const campground = await Campground.findById(id).populate('reviews');

    // console.log(campground)
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return(res.redirect('/campgrounds'))
    }
    res.render('campgrounds/show',{campground})
    
})) 
router.get('/:id/edit',  catchAsync(async (req,res) =>{ 

    const {id}=req.params;
    const campground = await Campground.findById(id);
    // console.log(campground)
    if(!campground){
        req.flash('error','Cannot find that campground!')
        return(res.redirect('/campgrounds'))
    }
    res.render('campgrounds/edit',{campground})
    
})) 
router.put('/:id', validateCampground, catchAsync(async (req,res) =>{ 

    const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body,{new:true});
    
    // console.log(campground)
    req.flash('success','Succesfully updated the campground!')
    res.redirect(`/campgrounds/${id}`)
    
})) 

router.delete('/:id',  catchAsync(async (req,res) =>{ 

    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    
    // console.log(campground)
    req.flash('success','Succesfully deleted a campground!');
    res.redirect(`/campgrounds`);
    
})) 

module.exports = router;
