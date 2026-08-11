import mongoose from "mongoose";
import User from "../models/users.js";
import bcrypt from "bcryptjs";

export const seedDefaultUsers = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log("No users found. Seeding default role accounts...");

            const defaultUsers = [
                { username: "officer", password: "officer123", role: "officer" },
                { username: "admin", password: "admin123", role: "admin" },
                { username: "viewer", password: "viewer123", role: "viewer" },
                { username: "replyperson", password: "reply123", role: "replyperson" },
            ];

            for (const u of defaultUsers) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await User.create({
                    username: u.username,
                    password: hashedPassword,
                    role: u.role
                });
            }
            console.log("Default role accounts (officer, admin, viewer, replyperson) seeded successfully!");
        } else {
            console.log(`Database contains ${count} user accounts.`);
        }
    } catch (err) {
        console.error("Error seeding default users:", err.message);
    }
};

const connectDB = async () => {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/railway_hq_lms";
    console.log("Connecting to MongoDB:", uri);

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
        console.log("MongoDB Connected Successfully");
        await seedDefaultUsers();
    } catch(error) {
        console.log("Primary MongoDB connection failed or timed out:", error.message);
        try {
            console.log("Starting in-memory MongoDB server as fallback...");
            const { MongoMemoryServer } = await import("mongodb-memory-server");
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            console.log("Connected to In-Memory MongoDB at:", memoryUri);
            await mongoose.connect(memoryUri);
            await seedDefaultUsers();
        } catch (fallbackError) {
            console.error("MongoDB Fallback connection error:", fallbackError.message);
            process.exit(1);
        }
    }
};

export default connectDB;