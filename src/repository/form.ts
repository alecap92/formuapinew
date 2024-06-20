import FormModel, { Form, FormToUpdate } from "../models/form";
import { normalizeText } from "../utils/normalizeText";
import FormFieldModel from "../models/formFields";

export class FormRepository {
  public async create(form: Form) {
    try {
      const newForm = await FormModel.create(form);
      console.log("A new form has been created", form);
      return newForm;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async findById(id: string) {
    try {
      const form = await FormModel.findById(id);
      const fields = await FormFieldModel.findOne({ form_id: id }).populate("fields");
      console.log(fields);
      return {
        ...form?.toJSON(),
        fields: fields?.fields,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async update(id: string, form: FormToUpdate) {
    try {
      const updatedForm = await FormModel.findByIdAndUpdate(id, form, { new: true });
      console.log("The form has been updated", updatedForm);
      return updatedForm;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async delete(id: string) {
    try {
      return await FormModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getAll(query?: string, limit: number = 10, page: number = 1) {
    try {
      const queryField: {
        name?: any;
        only_creator: boolean;
      } = {
        only_creator: false,
      };
      if (query) {
        const textNormalized = normalizeText(query);
        queryField["name"] = { $regex: textNormalized, $options: "i" };
      }
      return {
        forms: await FormModel.find(queryField)
          .limit(limit)
          .skip((page - 1) * limit),
        total: await FormModel.countDocuments(queryField),
        pages: Math.ceil((await FormModel.countDocuments(queryField)) / limit),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getFormByUser(id: string, query?: string, limit: number = 10, page: number = 1) {
    try {
      const queryField: {
        name?: any;
        created_by: string;
      } = {
        created_by: id,
      };
      if (query) {
        const textNormalized = normalizeText(query);
        queryField["name"] = { $regex: textNormalized, $options: "i" };
      }
      return {
        forms: await FormModel.find(queryField)
          .limit(limit)
          .skip((page - 1) * limit),
        total: await FormModel.countDocuments(queryField),
        pages: Math.ceil((await FormModel.countDocuments(queryField)) / limit),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async setFormFields(formId: string, fields: string[]) {
    try {
      const formFields = {
        form_id: formId,
        fields: fields,
      };

      return await FormFieldModel.create(formFields);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async getFieldsByForm(formId: string) {
    try {
      return await FormFieldModel.findOne({ form_id: formId });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async updateFormFields(formId: string, fields: string[]) {
    try {
      await FormFieldModel.findOneAndUpdate(
        {
          form_id: formId,
        },
        {
          fields: fields,
        },
      );
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
