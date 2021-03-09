const Joi = require('joi');


const joiIssueSchema = Joi.object({
    title: Joi.string().required(),
    text: Joi.string().required(),
    user: Joi.string().required(),
    closed: Joi.boolean().required(),
    image: Joi.array(),
    comment: Joi.array().items(Joi.object({
        user: Joi.string().required(),
        text: Joi.string().required()
    }))
})

const joiCommentSchema = Joi.object({
    user: Joi.string().required(),
    text: Joi.string().required()
})

module.exports = {joiCommentSchema, joiIssueSchema}