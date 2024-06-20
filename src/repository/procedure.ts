import ProcedureModel, { Procedure } from "../models/procedure";

export class ProcedureRepository {
  public async create(procedure: Procedure) {
    try {
      const newProcedure = await ProcedureModel.create(procedure);
      console.log("A new procedure has been created", procedure);
      return newProcedure;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getProcedure(id: string) {
    try {
      const procedure = await ProcedureModel.findById(id).populate("form").populate("values.field");
      return procedure;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getAllProcedures(limit: number = 10, page: number = 1) {
    try {
      const procedures = await ProcedureModel.find()
        .populate("form")
        .populate("values.field")
        .limit(limit)
        .skip(limit * (page - 1));
      return procedures;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
