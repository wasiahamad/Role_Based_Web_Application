import jwt from "jsonwebtoken";
import dotenv from "dotenv";    
dotenv.config();

// Middleware to authenticate user based on JWT token
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token missing",
            error: true,
            success: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid token",
                    error: true,
                    success: false,
                });
            }
            return decoded;
        });
        req.user = decoded;
        console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token",
            error: true,
            success: false,
        });
    }
}

// only for admin users
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied, admin only",
            error: true,
            success: false,
        });
    }
}
