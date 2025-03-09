import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Attendance from "../models/attendance.model.js";
import LeaveRequest from "../models/leaveRequest.model.js";
import jwt from "jsonwebtoken";

// Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id), // Generate JWT
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Manage attendance (Add, Edit, Delete)
export const manageAttendance = async (req, res) => {
  try {
    switch (req.method) {
      case "POST":
        const { userId, date, status } = req.body;

        // Validate inputs
        if (!userId || !date || !status) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        try {
          // Check for existing attendance
          const existingAttendance = await Attendance.findOne({ userId, date });
          if (existingAttendance) {
            return res
              .status(400)
              .json({ message: "Attendance already marked for this date" });
          }
          const newAttendance = new Attendance({
            userId,
            date: new Date(date),
            status,
          });
          await newAttendance.save();

          console.log("New Attendance:", newAttendance); // Log the saved attendance

          return res.status(201).json({
            message: "Attendance added",
            attendance: newAttendance,
          });
        } catch (error) {
          console.error("Error saving attendance:", error); // Log the error
          return res
            .status(500)
            .json({ message: "Error saving attendance", error: error.message });
        }

      case "PUT":
        const { id } = req.params;
        const updatedAttendance = await Attendance.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        );

        if (!updatedAttendance) {
          return res.status(404).json({ message: "Attendance not found" });
        }

        return res.status(200).json({
          message: "Attendance updated",
          attendance: updatedAttendance,
        });

      case "DELETE":
        const deletedAttendance = await Attendance.findByIdAndDelete(
          req.params.id
        );

        if (!deletedAttendance) {
          return res.status(404).json({ message: "Attendance not found" });
        }

        return res.status(200).json({ message: "Attendance deleted" });

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Attendance Management Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Manage leave requests
export const manageLeaves = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.method === "GET") {
      // View all leave requests
      const leaveRequests = await LeaveRequest.find().populate(
        "userId",
        "name email"
      );
      res.status(200).json(leaveRequests);
    } else if (req.method === "PUT") {
      const { action } = req.body; // action = "approve" or "reject"
      const leaveRequest = await LeaveRequest.findById(id);

      if (leaveRequest) {
        leaveRequest.status = action === "approve" ? "Approved" : "Rejected";
        await leaveRequest.save();
        res.status(200).json({ message: `Leave ${action}d`, leaveRequest });
      } else {
        res.status(404).json({ message: "Leave request not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate user report (FROM and TO dates)
export const generateUserReport = async (req, res) => {
  const { email, fromDate, toDate } = req.query;

  // Validate date inputs
  if (!email || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    // Ensure dates are parsed correctly
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Validate date objects
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Set time to start of day for from date and end of day for to date
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      email,
      date: {
        $gte: from,
        $lte: to,
      },
    });

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Generate system-wide attendance report (FROM and TO dates)
export const generateSystemReport = async (req, res) => {
  const { fromDate, toDate } = req.query;

  // Validate query parameters
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "Both 'fromDate' and 'toDate' are required." });
  }

  try {
    const attendance = await Attendance.find({
      date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    }).populate("userId", "name email");

    if (attendance.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for the given dates." });
    }

    res.status(200).json({
      message: "Attendance report generated successfully.",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while generating the attendance report.",
      error: error.message,
    });
  }
};
