const express= require('express');
const mongoose = require('mongoose');
const campgroundModel= require('./models/camp');
const review= require('./models/review');
const User= require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const app= express();
const campgroundRoutes= require('./routes/campgroundRoutes');
const users= require('./routes/users');
const cors = require('cors');


const path= require('path');

const methodOverride= require('method-override')
//const { findById } = require('./models/camp');  // do not know what it is 
const ejsMate= require('ejs-mate')
const AppError= require('./validations/AppError');   //error validations
const session= require('express-session');
const flash = require('connect-flash');


mongoose.set('strictQuery', true);          //mongoose depricated error 

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))                              //override the form method (using put, delete, etc.)
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig = {                         //setting the sessions 
    name:'cookie-session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+ 7*1000*24*60*60,
        maxAge:7*1000*24*60*60

    }
         
}

app.use(session(sessionConfig));



app.use(flash());


app.use(passport.initialize());                         
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    req.session.returnTo = req.session.returnTo;

    res.locals.currentUser= req.user;
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();

})

app.use('/campgrounds', campgroundRoutes);      //routing
app.use('/', users)


//mongodb+srv://<username>:<password>@myfirstcluster.fuhskcq.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect('mongodb+srv://rajansapkota:eln1wfPUfZ9LuzIF@myfirstcluster.fuhskcq.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('connected!!!'))
.catch(()=>console.log('error connecting to the mongoose'))

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');



app.get('/', (req, res)=>{
    console.log('this is 3000')
    res.render('home')
})

app.all('*', (req, res, next)=>{
    next(new AppError("Page Not Found!!", 404))
    
    
})

app.use((err, req, res, next)=>{
    const {message="Something went wrong", statusCode= 500}= err;
    
    res.status(statusCode)
    console.log(statusCode);
    res.render('campgrounds/error', {message, statusCode})
    next();
})

app.listen(3000,()=>{console.log('3000!!!')})