import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import User from "../models/user.model.js";
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

// user login controller based on email, password and role 
export const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase(), role: role });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                error: true,
                success: false,
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        res.status(200).json({
            message: "User logged in successfully",
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

// logout user controller
export const logoutUser = async (req, res) => {
    try {
        // Clear the token from cookies
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });

        res.status(200).json({
            message: "User logged out successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// for only admin get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).select("-password"); // Exclude password from response
        res.status(200).json({
            message: "Users fetched successfully",
            error: false,
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// for only admin delete user
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    // const userId = req.user.id;
    try {
        // Check if user exists
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Delete the user
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// chnage password controller
export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        // Check if user exists
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required",
                error: true,
                success: false,
            });
        }

        // Check if old password is correct
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid old password",
                error: true,
                success: false,
            });
        }

         // Check password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters long",
                error: true,
                success: false,
            });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(newPassword)) {
            return res.status(400).json({
                message: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",                
                error: true,
                success: false,
            });
        }

        // Check if new password is the same as old password
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);

        if (isNewPasswordSame) {
            return res.status(400).json({
                message: "New password must be different from the old password",
                error: true,
                success: false,
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// only admin create a new user
export const adminCreateNewUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required",
                error: true,
                success: false,
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
                error: true,
                success: false,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// export const getCurrentUser = async (req, res) => {
//     try {
//         const user = await UserModel.findById(req.user.userId).select('-password');
//         res.status(200).json({
//             success: true,
//             data: user
//         });
//     } catch (err) {
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };









