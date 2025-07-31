import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const registerUser = async (req, res) => {
    let user;
    // Extracting name, email, and password from request body
    const { name, email, password } = req.body;

    try {
        // validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email });
        
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                error: true,
                success: false,
            });
        }

        // Check name length
        if (name.length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters long",
                error: true,
                success: false,
            });
        }

        // Check email format
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                error: true,
                success: false,
            });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
                error: true,
                success: false,
            });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                error: true,
                success: false,
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            return res.status(500).json({
                message: "Error generating salt for password hashing",
                error: true,
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!hashedPassword) {
            return res.status(500).json({
                message: "Error hashing password",
                error: true,
                success: false,
            });
        }

        // Create a new user
        user = new UserModel({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "student", // default role
        });

        // Save the user to the database
        await user.save();

        // create token for user
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            {}
        );

        if (!token) {
            return res.status(500).json({
                message: "Error generating token",
                error: true,
                success: false,
            });
        }

        res.status(201).json({
            message: "User registered successfully",
            error: false,
            success: true,
            token: token,
            data: user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




