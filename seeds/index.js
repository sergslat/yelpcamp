const mongoose = require('mongoose');
const Campground = require('../models/campground')
const {descriptors,places}=require('./seedHelpers');
const cities = require('./cities');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
     useNewUrlParser: true,
     useCreateIndex: true,   
     useUnifiedTopology: true });
const db=mongoose.connection;


db.on("error", console.error.bind(console, "connection error:"));
db.once("open",() => {
    console.log ("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)]; //get a random element from an array

// console.log(`${sample(places)} ${sample(descriptors)}` )

const seedDB = async() =>{
    await Campground.deleteMany({});
    // const camp= new Campground({title:'Prueba', price:500})

    for(let i=0;i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: random1000,
            image: 'https://source.unsplash.com/featured/?nature,woods,sky',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus vel quo eum tenetur maxime rerum, debitis sint atque hic corrupti! Minus odit aperiam quis, esse unde nulla omnis possimus at.'
        })
        await camp.save();

    }
    
    
}

seedDB().then( () =>{
    mongoose.connection.close();
});