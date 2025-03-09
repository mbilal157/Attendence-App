import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // Status of the leave request
      default: "Pending", // Default status
    },
  },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;
