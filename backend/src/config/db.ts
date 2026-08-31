import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectdb = async (): Promise <void> =>{

    try {
     const conn= await mongoose.connect(ENV.MONGO_URI);
     console.log(`MongoDb connected: `, conn.connection.host);

        
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}