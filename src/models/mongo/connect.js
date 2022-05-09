import * as dotenv from "dotenv";
import Mongoose from "mongoose";

export async function connectMongo() {
  dotenv.config();

  console.log("Connecting to Mongo DB");
  try {
    await Mongoose.connect(process.env.MONGO_URL);
    console.log("Database loaded and connected");
  } catch (e) {
    console.log(e);
  }
}
