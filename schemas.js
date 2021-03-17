const Joi = require('joi')
const { number } = require('joi');

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0), 
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required()
    
 });

 module.exports.reviewSchema = Joi.object({

    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required()
    }).required()

 })

 