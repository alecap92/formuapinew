import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface Form {
  _id: string;
  name: string;
  description: string;
  created_by: ObjectId;
  create_at?: Date;
  update_at?: Date;
  only_creator: boolean;
  number_of_downloads: number;
  file: string;
}

export interface FormToUpdate extends Partial<Form> {}

const formSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    created_by: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    create_at: {
      type: Date,
      default: Date.now,
    },
    update_at: {
      type: Date,
      default: Date.now,
    },
    only_creator: {
      type: Boolean,
      default: false,
    },
    number_of_downloads: {
      type: Number,
      default: 0,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default model<Form>("Form", formSchema);
