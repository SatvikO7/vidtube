import { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const comments = await Comment.find({video: videoId})
        .populate("owner" , "username avatar")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt : -1})

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const { content } = req.body

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    if(!content || content.trim() === "") {
        throw new ApiError(400, "Content cannot be empty")
    }

    const newComment = new Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, newComment, "Comments added successfully"))
})

// const updateComment = asyncHandler(async (req, res) => {
//     // TODO: update a comment
// })

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }

    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if(comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Your sre not authorized to delete the comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comments deleted successfully"))
})

export {
    getComments, 
    addComment, 
    // updateComment,
    deleteComment
    }