import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";

dotenv.config(); // Load environment variables

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      name: "Admin", // Hardcoded name
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // This will be hashed via pre-save middleware
    });

    await admin.save();
    console.log("Admin seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
