import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE", "REPLY", "LOGIN"]
    },
    details: {
      type: String,
      required: true
    },
    letterNumber: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
