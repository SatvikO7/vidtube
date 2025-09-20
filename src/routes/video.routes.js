import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middlewares.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
} from "../controllers/video.controller.js";

const router = Router();

// 👉 Upload a new video (protected)
router.post(
  "/upload",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo   // ✅ FIXED
);

// 👉 Get all videos (public)
router.get("/", getAllVideos);

// 👉 Get single video by ID (public)
router.get("/:id", getVideoById);

// 👉 Update video details (protected)
router.put("/:id", verifyJWT, updateVideo);

// 👉 Delete a video (protected)
router.delete("/:id", verifyJWT, deleteVideo);

// 👉 Toggle publish status (protected)
router.patch("/:id/toggle-publish", verifyJWT, togglePublishStatus);


export default router;
