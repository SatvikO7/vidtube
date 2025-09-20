import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  getComments,
//   updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();
// 👉 Add a new comment on a video (protected)
router.route("/:videoId").post(verifyJWT, addComment)
// router.post("/:videoId", verifyJWT, addComment);

// 👉 Get all comments for a video (public)
router.route("/:videoId").get(verifyJWT, getComments)
// router.get("/:videoId", getComments);

// 👉 Update a comment (protected, only owner)
// router.put("/:commentId", verifyJWT, updateComment);

// 👉 Delete a comment (protected, only owner)
router.route("/:videoId").delete(verifyJWT, deleteComment)

// router.delete("/:commentId", verifyJWT, deleteComment);

export default router;
