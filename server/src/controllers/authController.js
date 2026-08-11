import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {

        const { username, password } = req.body;

        // Check fields
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        console.log("user found: ", user);
        

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password match:", passwordMatch);


        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );  

        console.log("USER BEFORE RESPONSE:", {
            id: user._id,
            username: user.username,
            role: user.role
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};