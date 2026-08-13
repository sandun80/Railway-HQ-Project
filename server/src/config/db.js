import mongoose from "mongoose";

const connectDB = async () => {

    const uri =
        process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/railway_hq_lms";

    console.log("Connecting to MongoDB:", uri);

    try {

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000
        });

        console.log("MongoDB Connected Successfully");

    } catch (error) {

        console.log(
            "Primary MongoDB connection failed or timed out:",
            error.message
        );

        try {

            console.log(
                "Starting in-memory MongoDB server as fallback..."
            );

            const { MongoMemoryServer } =
                await import("mongodb-memory-server");

            const mongoServer =
                await MongoMemoryServer.create();

            const memoryUri =
                mongoServer.getUri();

            console.log(
                "Connected to In-Memory MongoDB at:",
                memoryUri
            );

            await mongoose.connect(memoryUri);

        } catch (fallbackError) {

            console.error(
                "MongoDB Fallback connection error:",
                fallbackError.message
            );

            process.exit(1);
        }
    }
};

export default connectDB;