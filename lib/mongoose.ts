import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => { 
    mongoose.set('strictQuery', true);
    if (!process.env.DATABASE_URL) return console.log("DATABASE is not found");
    if (isConnected) return console.log("Already connect to database");
    
    try {
        await mongoose.connect(process.env.DATABASE_URL!)
        isConnected = true
        console.log("Connected successfully");
        
    } catch (error) {
        console.log("Failed to connect to database")
    }
    
}