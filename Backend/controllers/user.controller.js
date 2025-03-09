import User from "../models/user.model.js"; // User model
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark Attendance
export const markAttendance = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    const alreadyMarked = user.attendance.find((record) => {
      return record.date.toISOString().split("T")[0] === today;
    });

    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked today" });
    }

    user.attendance.push({ date: new Date(), status: "Present" });
    await user.save();

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// View Attendance
export const viewAttendance = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("attendance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // req.user comes from auth middleware
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save the file path in the user's profile
    user.profilePicture = `/uploads/${req.file.filename}`; // File path

    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
};

// Edit Profile Picture
export const editProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const { profilePicture } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send Leave Request
export const sendLeaveRequest = async (req, res) => {
  const userId = req.user.id;
  const { reason } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.leaveRequests.push({
      reason,
      status: "Pending",
      requestDate: new Date(),
    });

    await user.save();

    res.status(200).json({ message: "Leave request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
