const Joi = require('joi');

const joiCommentSchema = Joi.object({
    user: Joi.string().required(),
    text: Joi.string().required()
})

const joiIssueSchema = Joi.object({
    title: Joi.string().required(),
    text: Joi.string().required(),
    user: Joi.string().required(),
    closed: Joi.boolean().required(),
    file: Joi.any(),
    comment: Joi.array().items(joiCommentSchema)
})

module.exports = {joiIssueSchema, joiCommentSchema}