import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"; // ✅ check folder name
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

// 👉 Create new playlist (protected)
router.post("/create", verifyJWT, createPlaylist);

// 👉 Get all playlists of logged in user (protected)
router.get("/me", verifyJWT, getUserPlaylists);

// 👉 Get a specific playlist by ID (public)
router.get("/:playlistId", getPlaylistById);

// 👉 Add video to playlist (protected)
router.post("/:playlistId/videos/:videoId", verifyJWT, addVideoToPlaylist);

// 👉 Remove video from playlist (protected)
router.delete("/:playlistId/videos/:videoId", verifyJWT, removeVideoFromPlaylist);

// 👉 Update a playlist (protected)
router.put("/:playlistId", verifyJWT, updatePlaylist);

// 👉 Delete a playlist (protected)
router.delete("/:playlistId", verifyJWT, deletePlaylist);

export default router;
