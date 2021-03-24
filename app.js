const express= require('express');
const app=express();
const path= require('path');
const ExpressError=require('./utils/ExpressError')
const mongoose = require('mongoose');
const passport = require ('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const ejsMate= require ('ejs-mate');
app.engine('ejs', ejsMate)

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
     useNewUrlParser: true,
     useCreateIndex: true,   
    useUnifiedTopology: true,
    useFindAndModify: false
 });
const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",() => {
    console.log ("Database connected")
});

const methodOverride= require('method-override')
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

const session = require ('express-session')
const flash = require('connect-flash');
app.use(flash());

const sessionConfig= {
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // expires: Date.now() + 604800000,
        // maxAge: 604800000
        expires: Date.now() + 3600000,
        maxAge: 3600000
    }
}

app.use(session(sessionConfig));

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const usersRoutes = require('./routes/usersRoutes')


const port=3000;

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views')) 
app.use(express.urlencoded({extended : true}));




//Passport
app.use (passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware with every request
app.use((req,res,next) =>{
    if(!(['/login','/'].includes(req.originalUrl))){
        req.session.returnTo=req.originalUrl;
    }
    // console.log(req.originalUrl)
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currentUser=req.user;
    next();
})




//Route handlers
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use('/',usersRoutes)

app.get('/', (req,res) =>{ //Basic Routing to '/' home page

    res.render('home');
}) 

app.all ('*', (req,res,next) =>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    
    const{statusCode = 500 /*default*/}= err; 
    if(!err.message) err.message='Something went wrong...'
    
    res.status(statusCode).render('error',{err})
    // res.render('error');
    
})

app.listen(port,() =>{
    console.log(`APP is listening on port ${port} ...`)
})

