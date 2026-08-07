import mongoose from "mongoose";


const connectDB = async () => {

    console.log("Connected to:", process.env.MONGO_URI);

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    } catch(error) {

        console.log(error.message);

        process.exit(1);

    }

};


export default connectDB;