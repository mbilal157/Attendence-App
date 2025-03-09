import express from "express";
import {
  registerUser,
  loginUser,
  uploadProfilePicture,
  markAttendance,
  viewAttendance,
  editProfilePicture,
  sendLeaveRequest,
} from "../controllers/user.controller.js";
import { protect, upload } from "../middleware/authMiddleware.js"; // Middleware to protect routes

const router = express.Router();

// Public Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login a user

// Protected Routes (requires user to be logged in)
router.post("/attendance", protect, markAttendance); // Mark attendance
router.get("/attendance", protect, viewAttendance); // View attendance
router.post(
  "/upload-profile-picture",
  protect,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.put("/profile-picture", protect, editProfilePicture); // Edit profile picture
router.post("/leave-request", protect, sendLeaveRequest); // Send leave request

export default router;
