import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if(existingLike) {
        await existingLike.deleteOne()

        return res
            .status(200)
            .json(new ApiResponse(200, {} , "Like removed successfully")
    )} else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res
            .status(201)
            .json(new ApiResponse(201, {} ,"Video Liked"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if(existingLike) {
        await existingLike.deleteOne()

        return res
            .status(200)
            .json(new ApiResponse(200, {} , "Like removed from comment")
    )} else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res
            .status(201)
            .json(new ApiResponse(201, {} ,"Comment Liked"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLike) {
        await existingLike.deleteOne()

        return res
            .status(200)
            .json(new ApiResponse(200, {} , "Like removed from tweet")
    )} else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res
            .status(201)
            .json(new ApiResponse(201, {} ,"Tweet Liked"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        likedBy: req.user._id,
        vide: { $exists: true }
    }).populate("video", "title description url thumbnail")

    return res
        .status(200)
        .json(new ApiResponse(200, likes, "Liked videos fetched successfully"))
})

const getCommentLikes = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const totalLikes = await Like.countDocuments({ comment: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, { totalLikes }, "Comment likes fetched successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getCommentLikes
}