const Joi = require('joi');

module.exports.errorSchema = Joi.object({
    campground:Joi.object(
        {
            title:Joi.string().required(),
            price:Joi.number().required().min(0),
            location:Joi.string().required(),
            description:Joi.string().required(),
            // image:Joi.string().required()
            geometry:Joi.object()

        }
    ).required(),
    deleteImages:Joi.array()
})

module.exports.schemaReview = Joi.object({
    review:Joi.object(
        {
            body:Joi.string().required(),
            rating:Joi.number().required().min(1).max(5)
        }
    ).required()
})

