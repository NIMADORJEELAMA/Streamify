import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", protectRoute, upload.single("image"), createPost);
router.get("/", protectRoute, getPosts);
router.put("/:id", protectRoute, upload.single("image"), updatePost);
router.delete("/:id", protectRoute, deletePost);

// Like and Comment routes
router.post("/:id/like", protectRoute, toggleLike);
router.post("/:id/comment", protectRoute, addComment);

export default router;
