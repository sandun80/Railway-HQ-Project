import User from "../models/users.js";
import bcrypt from "bcryptjs";


export const getUsers = async (req, res) => {
    try{

        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;

        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (username && username !== existingUser.username) {
            const duplicateUser = await User.findOne({ username });

            if (duplicateUser && duplicateUser._id.toString() !== id) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }
        }

        const updateData = {
            username: username || existingUser.username,
            role: role || existingUser.role
        };

        if (password && password.trim()) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

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