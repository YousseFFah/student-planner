import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    instructor: {
      type: String,
      required: true,
      trim: true,
    },

    creditHours: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);