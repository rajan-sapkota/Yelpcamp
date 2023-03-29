const mongoose = require('mongoose');
const campgroundModel= require('../models/camp');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.set('strictQuery', true);


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>console.log('connected!!!'))
.catch(()=>console.log('error connecting to the mongoose'))


const newCity= async ()=>{
    await campgroundModel.deleteMany();
    for (let index = 0; index < 100; index++) {

        const sample= (Array)=> Array[Math.floor(Math.random()*Array.length)];
        const priceRand=  Math.floor(Math.random()*51);
        
        const rand = Math.floor(Math.random()*1000)
        
    
            const camp = new  campgroundModel({

            title:`${sample(descriptors)} ${sample(places)}`,
                price:priceRand,
            image:'https://source.unsplash.com/random/483251',
            Location: `${cities[rand].city}, ${cities[rand].state}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium molestias vel quas quam, deleniti possimus, obcaecati vitae libero impedit soluta perferendis nemo fuga, hic facilis doloremque voluptatibus nesciunt aspernatur perspiciatis?',
            author:'63cf164cfde194e59a2053b9'
        })
    await camp.save()
    console.log(camp);
    console.log(index)
    // console.log(title)
}
    
}
newCity();
