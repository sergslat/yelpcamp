const express = require ('express');
const app=express();
const router = express.Router({mergeParams:true});

const catchAsync = require ('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError')

const Campground = require('../models/campground')
const Review = require('../models/review')

const {reviewSchema} = require('../schemas');



const validateReview = (req,res,next) => {

    const {error} = reviewSchema.validate(req.body);
   //  console.log(error)
    
    if(error){

        const msg = error.details.map (el => el.message).join (',')
        throw new ExpressError (msg, 401)
        
    } else {
        next();
    }
}


router.delete('/:revId',  catchAsync(async (req,res) =>{ 

    const {id,revId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: revId}});
    await Review.findByIdAndDelete(revId)
    
    // console.log(campground)
    // res.send(`To delete review ${revId} from campground ${id}`)
    req.flash('success','Succesfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
    
})) 

router.post('/', validateReview, catchAsync( async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // console.log(review)
    // res.send(review)
    campground.reviews.push(review);
    
    await review.save();
    await campground.save();
    req.flash('success','Succesfully created a review!');
    
    res.redirect(`/campgrounds/${campground._id}`)

}))

module.exports = router;