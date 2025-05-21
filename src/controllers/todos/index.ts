import { Request, Response } from "express";
import { Todo } from "../../models/todos";

export const createATodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "invalid payload",
      });
    }

    const createNew = await Todo.create({
      ...req.body,
      userId: (req as any).user._id,
    });

    return res.status(201).json(createNew);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getAllTodo = async (req: Request, res: Response) => {
  try {
    const allTodos = await Todo.find({
      userId: (req as any).user._id,
    });

    if (allTodos.length === 0) {
      return res.status(404).json([]);
    }

    return res.status(200).json(allTodos);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({
        message: "invalid request",
      });
    }

    const createNew = await Todo.findOne({
      _id: todoId,
    });

    console.log("-------{", createNew);
    console.log("-------{", req.user._id);

    if (createNew?.userId.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({
        message: "You no longer access for this item",
      });
    }

    if (!createNew) {
      return res.status(404).json({
        message: "Not found or is removed permanently",
      });
    }

    return res.status(200).json(createNew);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const deleteATodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({
        message: "invalid request",
      });
    }

    const createNew = await Todo.findOneAndDelete({
      _id: todoId,
      userId: (req as any).user._id,
    });

    if (!createNew) {
      return res.status(400).json({
        message: "Somethinsg went wrong",
      });
    }

    return res.status(200).json(createNew);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const updateATodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({
        message: "invalid request",
      });
    }

    const existingTodo = await Todo.findById(todoId);

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (existingTodo?.userId.toString() !== (req as any).user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this todo" });
    }

    const createNew = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        userId: (req as any).user._id,
      },
      { $set: { ...req.body, updateAt: new Date() } },
      { new: true }
    );

    if (!createNew) {
      return res.status(400).json({
        message: "Somethinsg went wrong",
      });
    }

    return res.status(200).json(createNew);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
