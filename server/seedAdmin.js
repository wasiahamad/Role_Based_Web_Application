import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import UserModel from "./models/user.model.js";
import bcrypt from "bcrypt";    



// Function to seed the admin user
const seedAdmin = async () => {
    try {
        // Check if the admin user already exists
        const existingAdmin = await UserModel.findOne({ email: "admin@example.com" });

        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        // Create a new admin user
        const adminUser = new UserModel({
            name: "Admin User",
            email: "admin@gmail.com",
            password: "Admin@123",
            role: "admin",
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(adminUser.password, salt);

        // Save the admin user to the database
        await adminUser.save();
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};

// Connect to the database and seed the admin user
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        seedAdmin();
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });