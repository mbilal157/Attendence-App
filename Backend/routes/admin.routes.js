import express from "express";
import {
  loginAdmin,
  getAllUsers,
  manageAttendance,
  manageLeaves,
  generateUserReport,
  generateSystemReport,
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Admin-protected routes
router.use(protectAdmin); // Protect routes below with middleware

// Protected routes for admin
router.get("/users", protectAdmin, getAllUsers);

// Manage attendance (add, edit, delete)
router.post("/attendance", manageAttendance); // Add attendance
router.put("/attendance/:id", manageAttendance); // Edit attendance
router.delete("/attendance/:id", manageAttendance); // Delete attendance

// Manage leave requests
router.get("/leaves", manageLeaves); // View all leave requests
router.put("/leaves/:id/approve", manageLeaves); // Approve leave request
router.put("/leaves/:id/reject", manageLeaves); // Reject leave request

// Generate reports
router.get("/user-report", generateUserReport); // Generate report for a specific user
router.get("/system-report", protectAdmin, generateSystemReport); // Generate system-wide report

export default router;
