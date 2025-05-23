const express = require("express");
import { Request, Response } from "express";
import { Post } from "../../models/posts";
import mongoose from "mongoose";

const app = express.Router();

export const createAPost = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    let { title } = req.body;

    if (file === undefined) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    const mimeType = file.mimetype;
    const base64Data = file.buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const createNew = await Post.create({
      title: title ?? "",
      url: dataUrl,
      userId: req.user._id,
    });

    if (!createNew) {
      return res.status(401).json({ message: "Cannot able to uplaod file" });
    }

    return res.status(200).json(createNew);
  } catch (error) {
    return res.status(500).json({
      message: "Error processing file",
      error: (error as Error).message,
    });
  }
};

export const getAllMyPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      userId: req.user._id,
    }).populate("userId", "-password -__v");

    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error processing file",
      error: (error as Error).message,
    });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("userId", "-password -__v");

    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error processing file",
      error: (error as Error).message,
    });
  }
};

export const updateAPost = async (req: Request, res: Response) => {
  try {
    let { postId } = req.params;

    const existingTodo = await Post.findById(postId);

    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (existingTodo?.userId.toString() !== (req as any).user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this todo" });
    }

    const posts = await Post.findOneAndUpdate(
      {
        _id: postId,
        userId: (req as any).user._id,
      },
      { $set: { ...req.body, updateAt: new Date() } },
      { new: true }
    );

    if (!posts) {
      return res.status(400).json({
        message: "Somethinsg went wrong",
      });
    }

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      message: "Error processing file",
      error: (error as Error).message,
    });
  }
};
export const likeAPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user._id;

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userHasLiked = post.likedBy?.some(
      (id) => id?.toString() === userId.toString()
    );

    if (userHasLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => id?.toString() !== userId.toString()
      );
    } else {
      post.likedBy.push(new mongoose.Types.ObjectId(userId));
    }

    await post.save();

    return res.status(200).json({
      message: userHasLiked ? "Post unliked" : "Post liked",
      post,
    });
  } catch (error) {
    console.log("log error", error);
    return res.status(500).json({
      message: "Error processing file",
      error: (error as Error).message,
    });
  }
};
