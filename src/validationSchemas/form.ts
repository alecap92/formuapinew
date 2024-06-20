import joi from "joi";

export const formValidationSchema = joi.object({
  name: joi.string().min(6).max(255).required(),
  description: joi.string().min(6).max(255).required(),
  only_creator: joi.boolean().optional(),
});
