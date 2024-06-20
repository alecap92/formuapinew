import { NextFunction, Request, Response } from "express";

export class ProcedureMiddleware {
  public validateProcedure(req: Request, res: Response, next: NextFunction) {
    const { form, values } = req.body;
    if (!form || !values) {
      return res.status(400).json({ message: "Invalid data" });
    }
    next();
  }
}
