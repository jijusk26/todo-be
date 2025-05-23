const express = require("express");
import multer from "multer";
import {
  createAPost,
  getAllMyPosts,
  getAllPosts,
  likeAPost,
  updateAPost,
} from "../../controllers/posts";
import { verifyToken } from "../../helpers/jwt-token";

const app = express.Router();
const upload = multer();

app.get("/", verifyToken, getAllPosts);
app.get("/myposts", verifyToken, getAllMyPosts);
app.post("/upload", verifyToken, upload.single("file"), createAPost);
app.put("/update/:postId", verifyToken, updateAPost);
app.put("/:postId/:status", verifyToken, likeAPost);

export { app as PostRouter };
