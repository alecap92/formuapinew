import { Schema, model } from "mongoose";

export enum FieldType {
  Input = "input",
  TextArea = "textarea",
  Select = "select",
  Checkbox = "checkbox",
  Radio = "radio",
  Date = "date",
  Time = "time",
}

export interface Field {
  _id?: string;
  name: string;
  type: FieldType;
  required: boolean;
  key: string;
  created_at?: Date;
  updated_at?: Date;
}

const fieldSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(FieldType),
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [String],
      default: [],
    },
    key: {
      type: String,
      required: true,
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

export default model<Field>("Field", fieldSchema);
