import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_DB_url = process.env.MONGODB_URL;
const mongoDB_connection = async () => {
  try {
    await mongoose.connect(mongo_DB_url);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB Failed", error);
  }
};

export default mongoDB_connection;
