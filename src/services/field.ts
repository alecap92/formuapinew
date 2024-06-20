import { Request, Response } from "express";
import { FieldRepository } from "../repository/field";
import { Field } from "../models/field";

export class FieldServices {
  public async createField(req: Request<{}, {}, Field, {}>, res: Response) {
    try {
      const field = req.body;
      const fieldRepository = new FieldRepository();
      const createdField = await fieldRepository.create(field);
      return res.status(201).send(createdField);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }

  public async getFields(
    req: Request<
      {},
      {},
      {},
      {
        query: string;
        limit: number;
        page: number;
      }
    >,
    res: Response,
  ) {
    try {
      const { query, limit, page } = req.query;
      const fieldRepository = new FieldRepository();
      const fields = await fieldRepository.findAll(query, limit, page);
      return res.status(200).send(fields);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
}
