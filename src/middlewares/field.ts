import { Request, Response, NextFunction } from "express";
import { Field } from "../models/field";
import { fieldValidationSchema } from "../validationSchemas/field";

export class FieldMiddleware {
  public async validateField(req: Request<{}, {}, Field, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = fieldValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).send(error.details);
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
}
