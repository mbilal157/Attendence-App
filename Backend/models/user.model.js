import mongoose from "mongoose";
import { hashPassword, matchPassword } from "../middleware/authMiddleware.js";
// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },
    attendance: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          required: true,
        },
      },
    ],
    leaveRequests: [
      {
        requestDate: {
          type: Date,
          default: Date.now,
        },
        reason: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
      },
    ],
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password
userSchema.pre("save", hashPassword);

// Instance method to compare passwords
userSchema.methods.matchPassword = function (enteredPassword) {
  return matchPassword(enteredPassword, this.password);
};

// Export the User Model
const User = mongoose.model("User", userSchema);
export default User;
