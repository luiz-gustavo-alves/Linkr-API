import Joi from 'joi'

export const userSignUpSchema = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   imageURL: Joi.string().uri().required(),
   password: Joi.string().required()
})

export const userSignInSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().required()
})
