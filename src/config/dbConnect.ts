import { dbConnectionType } from "@/types/types";
import mongoose from "mongoose";

const isConnectedObj: dbConnectionType = {};

export default async function db_connect() {
  try {
    if (isConnectedObj.isConnected) {
      return;
    }

    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/db_next_learn`
    );

    if (connection) {
      isConnectedObj.isConnected = connection.connections[0].readyState;

      console.log(`DB connection success`);
      return;
    }
    console.log(`DB connection failed`);
  } catch (error: any) {
    console.error(`DB connection failed ${error}`);
    throw new Error(error.message);
  }
}
