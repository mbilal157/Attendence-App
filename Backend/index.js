import express from "express";
import { connectDB } from "./dB/connectDb.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3000, async () => {
  try {
    await connectDB();
    console.log("Server is running on port 3000");
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
});
