import Joi from "joi";

export const postsSchema = Joi.object({

    description: Joi.string().max(255).required(),
    URL: Joi.string().uri().max(2048).required()
})