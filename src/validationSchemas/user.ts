import joi from "joi";

export const userValidationSchema = joi.object({
  first_name: joi.string().min(6).max(255).required(),
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(6).max(1024).required(),
  last_name: joi.string().min(6).max(255).required(),
  document: joi.string().min(6).max(255).optional(),
  document_type: joi.string().min(6).max(255).optional(),
});

export const loginUserValidationSchema = joi.object({
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(6).max(1024).required(),
});
