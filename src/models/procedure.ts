import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";
import { Field } from "./field";
import { Form } from "./form";

export interface Procedure {
  create_at?: Date;
  update_at?: Date;
  form: string | Form;
  values: {
    field: string | Field;
    value: string;
  }[];
  user: string;
}

export const procedureSchema = new Schema(
  {
    form: {
      type: ObjectId,
      required: true,
      ref: "Form",
    },
    values: [
      {
        field: {
          type: Schema.ObjectId,
          required: true,
          ref: "Field",
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
  },
  { versionKey: false },
);

export default model<Procedure>("Procedure", procedureSchema);
