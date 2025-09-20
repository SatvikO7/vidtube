import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getMyDashboard,
  getChannelDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

// 👉 Dashboard for logged in user (protected)
router.get("/me", verifyJWT, getMyDashboard);

// 👉 Dashboard for a specific channel (public)
router.get("/channel/:channelId", getChannelDashboard);

export default router;
