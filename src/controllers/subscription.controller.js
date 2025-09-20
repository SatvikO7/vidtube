import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })

    if(existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res
            .status(200)
            .json(new ApiResponse(200, "Unsubscribed successfully", null)
    )} else {
        const newSubscription = new Subscription({
            subscriber: req.user._id,
            channel: channelId
        })

        await newSubscription.save();  

        return res
            .status(201)
            .json(new ApiResponse(201, newSubscription ,"Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel Id")
    }

    const subscribers = await Subscription.find({ channel: channelId})
        .populate("subscriber", "username email avatar") //to fecth user details

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber Id")
    }

    const channels = await Subscription.find({subscriber: subscriberId})
        .populate("channel", "username email avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}