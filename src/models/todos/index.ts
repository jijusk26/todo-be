import mongoose from "mongoose";

export type TodoStatus =
  | "yet-to-start"
  | "in-progress"
  | "on-hold"
  | "completed";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["yet-to-start", "in-progress", "on-hold", "completed"],
    default: "yet-to-start",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  spent: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
});

export const Todo = mongoose.model("Todo", todoSchema);
