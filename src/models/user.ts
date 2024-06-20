import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      default: "",
    },
    document_type: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    birth_date: {
      type: Date,
      default: "",
    },
    document_expedition_date: {
      type: Date,
      default: "",
    },
    create_at: {
      type: Date,
      default: Date.now,
    },
    update_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export interface User {
  email: string;
  password: string;
  name: string;
  last_name: string;
  document: string;
  document_type: string;
  create_at?: Date;
  update_at?: Date;
  _id?: ObjectId;
}

export default model<User>("User", userSchema);
