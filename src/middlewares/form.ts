import { Request, Response, NextFunction } from "express";
import { Form } from "../models/form";
import { formValidationSchema } from "../validationSchemas/form";
import { FormRepository } from "../repository/form";

export class FormMiddleware {
  public async validateForm(req: Request<{}, {}, Form, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = formValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).send(error.details[0]);
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }

  public async validateFormExist(req: Request<{ id: string }, {}, {}, {}>, res: Response, next: NextFunction) {
    try {
      const form = new FormRepository();
      const formExist = await form.findById(req.params.id);
      if (!formExist) {
        return res.status(400).send("Form does not exist");
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }

  public async validateFormDontHaveFields(
    req: Request<{}, {}, { form_id: string }, {}>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { form_id } = req.body;

      const form = new FormRepository();
      const formExist = await form.getFieldsByForm(req.body.form_id);
      console.log(form_id, "Form already have fields");
      if (formExist) {
        return res.status(400).send("Form already have fields");
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
}
