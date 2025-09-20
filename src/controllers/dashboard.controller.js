import { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscriptions.models.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// 👉 Dashboard for logged-in user (protected)
const getMyDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const totalVideos = await Video.countDocuments({ owner: userId })
    const totalSubscribers = await Subscription.countDocuments({ owner: userId })

    const videoIds = (await Video.find({ owner: userId }).select("_id")).map(v => v._id)
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

    const totalViewsAgg = await Video.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])
    const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].totalViews : 0

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews
        }, "My dashboard fetched successfully")
    )
})

// 👉 Dashboard for a specific channel (public)
const getChannelDashboard = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const totalVideos = await Video.countDocuments({ owner: channelId })
    const totalSubscribers = await Subscription.countDocuments({ owner: channelId })

    const videoIds = (await Video.find({ owner: channelId }).select("_id")).map(v => v._id)
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

    const totalViewsAgg = await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])
    const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].totalViews : 0

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalLikes,
            totalViews
        }, "Channel dashboard fetched successfully")
    )
})

export {
    getMyDashboard,
    getChannelDashboard
}
