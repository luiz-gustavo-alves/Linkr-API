import Joi from "joi";

export const commentsSchema = Joi.object({
  userID_owner: Joi.number().integer().required(),
  postID: Joi.number().integer().required(),
  comment: Joi.string().required()
});
