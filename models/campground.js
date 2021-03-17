const mongoose = require('mongoose');
const Schema = mongoose.Schema; //variable to avoid typing mongoose.Schema along the code
const Review = require('./review')


const CampgroundSchema = new Schema({

    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
    
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {

    // console.log(campground);

    
    if(campground.reviews.length){

        const res = await Review.deleteMany({
            _id: {
                $in:campground.reviews
            }
        }) //delete reviews whose ids are in the campground's reviews array
        console.log(res)
    }

    


})

module.exports = mongoose.model('Campground',CampgroundSchema);