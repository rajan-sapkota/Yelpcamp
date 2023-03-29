const express= require('express');

const router = express.Router();
const campgroundModel= require('../models/camp');
const review= require('../models/review');
const {reviewSchema}= require('../schemas.js');
const AppError= require('../validations/AppError');   //error validations
const isLoggedIn = require('../middleware');
const wrapError= require('../validations/WrapError');
const validator = (req, res, next)=>{
    const {campSchema}= require('../schemas.js');
    const {reviewSchema}= require('../schemas.js');
    


    const {error}= (campSchema.validate(req.body));
   
    if(error){
        const msg= error.details.map(el=>el.message).join(',')
        throw new AppError(msg, 400)
    }else next();
}
const reviewValidator = (req, res, next)=>{
        
    const {error}= (reviewSchema.validate(req.body));
   
    if(error){
        const msg= error.details.map(el=>el.message).join(',')
        throw new AppError(msg, 400)
    }else next();
}


router.get('', wrapError(async(req, res)=>{
    
    console.log('this is campground')
    const camp= await campgroundModel.find();
    res.render('Campgrounds/campgrounds', {camp})
}))

router.get('/new', isLoggedIn, wrapError(async(req, res)=>{
    
    return res.render('campgrounds/newCamp')}
    
))

router.post('', validator, wrapError(async(req, res)=>{
    
     

    
    //await campgroundModel.create(req.body);
    const newItem =  new campgroundModel(req.body);
    console.log(req.user)
    newItem.author= req.user;
    
    await newItem.save();
    
    req.flash('success', 'Successfully created a new campground')
    
    res.redirect(`/campgrounds/${newItem._id}`)
}))

router.post('/review/:id',isLoggedIn, reviewValidator, wrapError(async(req, res, next)=>{
    const {id}= req.params;
    
    const currentCamp= await campgroundModel.findById(id);
    const {rating}=req.body;
    if(rating==0){
        req.flash('error', 'rating cannot be 0');
        return res.redirect(`/campgrounds/${id}`);
    }
     console.log(rating);
    const newReview = new review(req.body);
    newReview.author= req.user;
    currentCamp.reviews.push(newReview);
    
    await newReview.save();
    await currentCamp.save();
    req.flash('success', 'added a new review');
    


    res.redirect(`/campgrounds/${id}`);
}))


router.get('/:id/edit', isLoggedIn, wrapError(async(req, res)=>{
    const campground= await campgroundModel.findById(req.params.id).populate('author')
    console.log(req.user==campground.author);
    if(req.user!==campground.author){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        req.flash('error', "you don't have the permission to do that!!")
        return res.redirect(`/campgrounds/${campground._id}`);

    }
    else{
    res.render('campgrounds/edit', {campground});}
}))

router.put('/:id', isLoggedIn, validator, wrapError(async(req, res)=>{
    const {id}= req.params;
    
    

    await campgroundModel.findByIdAndUpdate(id, req.body);
    req.flash('success', 'updated the campground');
    return res.redirect('/campgrounds/'+id);
}))

router.delete('/:id', isLoggedIn, wrapError(async(req, res)=>{
    const {id}= req.params;
    
    console.log('deleted')
    req.flash('success', 'deleted the campground');
    await campgroundModel.findByIdAndDelete(id);
   
    res.redirect('/campgrounds');
}))

router.delete('/:id/review/:reviewid',async(req, res, next)=>{
    const {id, reviewid}= req.params;
    await campgroundModel.findByIdAndUpdate(id, {$pull: {reviews:reviewid }});
    await review.findByIdAndDelete(reviewid);
    req.flash('success', 'deleted the review');
    res.redirect(`/campgrounds/${id}`)
})

router.get('/:id', wrapError(async(req, res, next)=>{
    const {id} = req.params;
    const campground = await campgroundModel.findById(id).populate({path: 'reviews', populate:{path:'author'}}).populate('author');
    if(!campground){
        
        console.log('no campground found!!!');
        req.flash('error', 'cannot find the campground');
        return res.redirect('/campgrounds');
        
    
    }
    
    //console.log(campground);
    const currentUser= req.user;
    
    return res.render('campgrounds/show', {campground, currentUser})
    
}))
router.get('/', (req, res)=>{
    console.log('this is 3000')
    res.render('home')
})

router.all('*', (req, res, next)=>{
    next(new AppError("Page Not Found!!", 404))
    
    
})

router.use((err, req, res, next)=>{
    const {message="Something went wrong", statusCode= 500}= err;
    console.log(err)
    res.status(statusCode)
    console.log(statusCode);
    res.render('campgrounds/error', {message, statusCode})
    next();
})





module.exports= router;
