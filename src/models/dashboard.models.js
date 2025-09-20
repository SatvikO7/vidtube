import mongoose, { Schema } from "mongoose";

const dashboardSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User", // links to your User model
      required: true,
      unique: true, // one dashboard per channel/user
    },

    // 📊 Channel stats
    totalVideos: {
      type: Number,
      default: 0,
    },
    totalSubscribers: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },

    // ⏳ Recent activity (optional)
    recentVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
