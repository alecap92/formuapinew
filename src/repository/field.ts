import { Request, Response } from "express";
import FieldModel, { Field } from "../models/field";
import { normalizeText } from "../utils/normalizeText";

export class FieldRepository {
  public async create(field: Field) {
    try {
      return await FieldModel.create(field);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async findAll(query?: string, limit: number = 10, page: number = 1) {
    try {
      const queryField: {
        name?: any;
      } = {};
      if (query) {
        const textNormalized = normalizeText(query);
        queryField["name"] = { $regex: textNormalized, $options: "i" };
      }
      const total = await FieldModel.countDocuments(queryField);
      return {
        fields: await FieldModel.find(queryField)
          .limit(limit)
          .skip((page - 1) * limit),
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
