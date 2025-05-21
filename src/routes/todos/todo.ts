import { Request, Response } from "express";
import { verifyToken } from "../../helpers/jwt-token";
import {
  createATodo,
  deleteATodo,
  getAllTodo,
  getTodoById,
  updateATodo,
} from "../../controllers/todos";

const express = require("express");

const app = express.Router();

app.get("/", verifyToken, getAllTodo);
app.post("/", verifyToken, createATodo);
app.get("/:todoId", verifyToken, getTodoById);
app.delete("/:todoId", verifyToken, deleteATodo);
app.put("/:todoId", verifyToken, updateATodo);

export { app as TodoRouter };
