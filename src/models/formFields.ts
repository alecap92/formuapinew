import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface FormField {
  fields: ObjectId[];
  form_id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

const formFieldSchema = new Schema(
  {
    fields: {
      type: [
        {
          type: Schema.ObjectId,
          require: true,
          ref: "Field",
        },
      ],
      required: true,
    },
    form_id: {
      type: ObjectId,
      required: true,
      ref: "Form",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<FormField>("FormField", formFieldSchema);
