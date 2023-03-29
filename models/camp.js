const mongoose= require('mongoose');
const Schema =  mongoose.Schema;


const campgroundSchema = new Schema({
    title: String,
    description:String,
    image:String,
    Location: String,
    price:Number,
    reviews:[{
        type:Schema.Types.ObjectId, ref:'Review'
    }],
    author: {
        type:Schema.Types.ObjectId, ref:'User'
    }

})

module.exports= mongoose.model('Campground', campgroundSchema);