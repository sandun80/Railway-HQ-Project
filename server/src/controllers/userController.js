import User from "../models/users.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            role
        } = req.body;

        // Check required fields
        if (!username || !password || !role) {
            return res.status(400).json({
                message: "Username, password and role are required"
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Failed to create user"
        });
    }
};