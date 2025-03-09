import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
