import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getCommentLikes,
} from "../controllers/like.controller.js";

const router = Router();

// 👉 Toggle like/unlike on a video (protected)
router.post("/video/:videoId", verifyJWT, toggleVideoLike);

// 👉 Toggle like/unlike on a comment (protected)
router.post("/comment/:commentId", verifyJWT, toggleCommentLike);

// 👉 Toggle like/unlike on a tweet (protected)
router.post("/tweet/:tweetId", verifyJWT, toggleTweetLike);

// 👉 Get all liked videos by logged in user (protected)
router.get("/videos", verifyJWT, getLikedVideos);

// 👉 Get total likes of a comment (public)
router.get("/comment/:commentId", getCommentLikes);

export default router;
