import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  subscribeChannel,
  unsubscribeChannel,
  getSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

// 👉 Subscribe to a channel
router.post("/:channelId/subscribe", verifyJWT, subscribeChannel);

// 👉 Unsubscribe from a channel
router.post("/:channelId/unsubscribe", verifyJWT, unsubscribeChannel);

// 👉 Get all subscribers of a channel
router.get("/:channelId/subscribers", getSubscribers);

// 👉 Get all channels user subscribed to
router.get("/me/subscribed", verifyJWT, getSubscribedChannels);

export default router;
