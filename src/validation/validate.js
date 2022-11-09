import Joi from "joi"

export const signInValidate=Joi.object({
    username:Joi.string().required(),
    password:Joi.string().min(5).required()
}).required()

export const postVideo=Joi.object({
    title:Joi.string().required(),
    author:Joi.string(),
    thumbnail:Joi.string().required().pattern(new RegExp(/\.(mp4|mkv)$/i))
}).required()