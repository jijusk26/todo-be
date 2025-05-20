import dotenv from "dotenv";
const express = require("express");
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { UserRouter } from "./routes/user";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI ?? "mongodb://localhost:27017/todos")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

app.get("/", async (_req: Request, res: Response) => {
  res.status(201).json("api working sucessfully");
});

app.use("/login", UserRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
