import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import letterRoutes from "./routes/letterRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoute.js";
import departmentRoutes from "./routes/departmentRoute.js";

dotenv.config();

const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/api/letters", letterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/departments", departmentRoutes);


// Test route
app.get("/", (req, res) => {
    res.send("API Running");
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});