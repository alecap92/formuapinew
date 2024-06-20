import { Request, Response, NextFunction } from "express";
import { Form } from "../models/form";
import { FormRepository } from "../repository/form";
import { ProcedureRepository } from "../repository/procedure";
import { Field } from "../models/field";
import path = require("path");
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { uploadFileFromStreamUpload } from "../utils/uploadFileFromStream";
import { b2 } from "../db";

export class FormServices {
  public async createForm(req: Request<{}, {}, Form, {}>, res: Response, next: NextFunction) {
    try {
      const formRepository = new FormRepository();
      req.body.file = "/form.pdf";
      req.body.created_by = req.user._id!;
      const form = await formRepository.create(req.body);
      return res.status(201).send(form);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getForm(req: Request, res: Response) {
    try {
      const formRepository = new FormRepository();
      const form = await formRepository.findById(req.params.id);
      return form ? res.status(200).send(form) : res.status(404).send("Form not found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async updateForm(
    req: Request<
      {
        id: string;
      },
      {},
      Form,
      {}
    >,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const formRepository = new FormRepository();
      const form = await formRepository.update(req.params.id, req.body);
      return form ? res.status(200).send(form) : res.status(404).send("Form not found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async deleteForm(req: Request, res: Response) {
    try {
      const formRepository = new FormRepository();
      const form = await formRepository.delete(req.params.id);
      return form ? res.status(200).send(form) : res.status(404).send("Form not found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getAllForms(
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
      const formRepository = new FormRepository();
      const forms = await formRepository.getAll(query, limit, page);
      return res.status(200).send(forms);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getFormsByUser(
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
      const formRepository = new FormRepository();
      const forms = await formRepository.getFormByUser(req.user._id! as unknown as string, query, limit, page);
      return res.status(200).send(forms);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async addFieldsToForm(
    req: Request<
      {},
      {},
      {
        form_id: string;
        fields: string[];
      },
      {}
    >,
    res: Response,
  ) {
    try {
      const { form_id, fields } = req.body;
      const formRepository = new FormRepository();
      const formFields = await formRepository.setFormFields(form_id, fields);
      return res.status(200).send(formFields);
    } catch (error) {
      console.log(error);
      return res.status(400).send(JSON.stringify(error));
    }
  }

  public async updateFormFields(
    req: Request<
      {},
      {},
      {
        form_id: string;
        fields: string[];
      },
      {}
    >,
    res: Response,
  ) {
    try {
      const { form_id, fields } = req.body;
      const formRepository = new FormRepository();
      const formFields = await formRepository.updateFormFields(form_id, fields);
      return res.status(200).send(formFields);
    } catch (error) {
      console.log(error);
      return res.status(400).send(JSON.stringify(error));
    }
  }

  public async generateFormProcedure(
    req: Request<
      {},
      {},
      {
        form: string;
        values: [{ field: string; value: string }];
      },
      {}
    >,
    res: Response,
  ) {
    try {
      const { form, values } = req.body;

      const procedure = {
        form,
        values,
        user: req.user._id as unknown as string,
      };

      const procedureRepository = new ProcedureRepository();
      const newProcedure = await procedureRepository.create(procedure);
      return res.status(200).send(newProcedure);
    } catch (error) {
      console.log(error);
      return res.status(400).send(JSON.stringify(error));
    }
  }

  public async getProcedure(req: Request<{ id: string }, {}, {}, {}>, res: Response) {
    try {
      const procedureRepository = new ProcedureRepository();
      const procedure = await procedureRepository.getProcedure(req.params.id);
      return procedure ? res.status(200).send(procedure) : res.status(404).send("Procedure not found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getAllProcedures(
    req: Request<
      {},
      {},
      {},
      {
        limit: number;
        page: number;
      }
    >,
    res: Response,
  ) {
    try {
      const { limit, page } = req.query;
      const procedureRepository = new ProcedureRepository();
      const procedures = await procedureRepository.getAllProcedures(limit, page);
      return res.status(200).send(procedures);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async uploadFormTemplate(req: Request<{ form_id: string }, {}, {}, {}>, res: Response) {
    try {
      const { form_id } = req.params;
      await uploadFileFromStreamUpload(req.file!, form_id! + ".pdf");
      return res.status(200).send("Form template uploaded successfully");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async generateFormPdf(req: Request<{ procedure_id: string }, {}, {}, {}>, res: Response) {
    try {
      const procedureRepository = new ProcedureRepository();
      const procedure = await procedureRepository.getProcedure(req.params.procedure_id);
      if (!procedure) {
        return res.status(404).send("Procedure not found");
      }
      const formuForm = procedure.form as Form;
      const response = await b2.downloadFileByName({
        bucketName: process.env.BACKBLAZE_BUCKET_NAME!,
        fileName: formuForm._id + ".pdf",
        responseType: "arraybuffer",
      });
      const pdfDoc = await PDFDocument.load(await response.data);
      const fields = procedure.values.map((value) => {
        const field: Field = value.field as Field;
        return {
          key: field.key,
          value: value.value,
        };
      });
      const form = pdfDoc.getForm();
      fields.forEach((field) => {
        const formField = form.getTextField(field.key);
        formField.setText(field.value);
      });
      const modifiedBytes = await pdfDoc.save();
      return res
        .set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${procedure._id}.pdf`,
        })
        .status(200)
        .send(Buffer.from(modifiedBytes.buffer));
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }
}












