import Joi from "joi";
import { FieldType } from "../models/field";

export const fieldValidationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  type: Joi.string()
    .valid(...Object.values(FieldType))
    .required(),
  required: Joi.boolean().optional(),
  options: Joi.array().items(Joi.string()).optional(),
  key: Joi.string().min(2).max(255).required(),
});
