import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in .env file');
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;