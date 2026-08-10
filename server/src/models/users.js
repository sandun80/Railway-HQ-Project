import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    userName: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },

     password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: ["officer", "role2", "role3"]
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;