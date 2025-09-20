import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

// Create a tweet (protected)
router.post("/", verifyJWT, createTweet);

// Get tweet by ID (public)
router.get("/:tweetId", getUserTweets);

//Update a tweet (protected, owner only)
router.put("/:tweetId", verifyJWT, updateTweet);

// Delete a tweet (protected, owner only)
router.delete("/:tweetId", verifyJWT, deleteTweet);

export default router;
