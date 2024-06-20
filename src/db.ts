import { connect } from "mongoose";
import B2 from "backblaze-b2";
import { config } from "dotenv";

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
};

config();
export const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_KEY_ID!,
  applicationKey: process.env.BACKBLAZE_KEY!,
});

export async function b2Connect() {
  try {
    await b2.authorize();
    console.log("Connected to Backblaze B2");
  } catch (error) {
    console.log(error);
  }
}
