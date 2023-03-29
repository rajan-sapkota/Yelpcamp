const Joi = require('joi')
module.exports.campSchema = Joi.object({
    title:Joi.string().required(),
    Location:Joi.string().required(),
    image:Joi.string().required(),
    price:Joi.number().min(0).required(),
    description:Joi.string().required()
})  

module.exports.reviewSchema= Joi.object({
    body:Joi.string().required(),
    rating:Joi.number().min(0).required()
}).required()
