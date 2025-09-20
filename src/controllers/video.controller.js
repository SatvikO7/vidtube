import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const filter = {}
    if(query)
    {
        filter.title= { $regex: query, $options: "i" }
    }
    if( userId && isValidObjectId(userId))
        filter.owner=userId

    const sortOrder =sortType === "asc" ? 1:-1

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortOrder})
        .skip((page - 1)*limit)
        .limit(Number(limit))
        .populate("owner","username avatar")

    const total = await Video.countDocuments(filter)

    return res.status(200).json( new ApiResponse(200, {
        videos,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)},
        "Videos fetched successfully"
    ))

})


//Publish a new Video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if(!title || !description)
    {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath)
    {
        throw new ApiError(400, "Video and thumbnail files are required")
    }

    let videoUpload , thumbnailUpload
    try {
        videoUpload = await uploadCloudinary(videoLocalPath, "video")
        thumbnailUpload = await uploadCloudinary(thumbnailLocalPath, "image")

        
        if(!videoUpload?.secure_url || !thumbnailUpload?.secure_url) 
        {
            throw new ApiError(500, "Upload failed, Cloudinary did not return URL")
        }
    } catch(error) {
        throw new ApiError(500, "Error uploading files to Cloudinary")
    }

    try {
        const video = await Video.create ({
            title,
            description,
            videoUrl: videoUpload.secure_url,
            thumbnailUrl: thumbnailUpload.secure_url,
            duration: videoUpload?.duration || 0,
            owner: req.user._id
        })

        return res.status(201).json(new ApiResponse(201, video, "Video published successfully"))
    } catch (error) {
        if( videoUpload?.public_id) await deleteFromCloudinary(videoUpload.public_id)
        if( thumbnailUpload?.public_id) await deleteFromCloudinary(thumbnailUpload?.public_id)

        throw new ApiError(500, "Error saving video to database")
    }

})


// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar email")

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})


//Update video Details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const {title, description} = req.body

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video ID")
    }

    const updateData = {}
    if(title) updateData.title = title
    if(description) updateData.description = description

    if(req.files?.thumbnail?.[0]?.path) {
        const thumbnailLocalPath = await uploadOnCloudinary(req.files.thumbnail[0].path,"image")
        if(!thumbnailLocalPath?.secure_url) throw new ApiError(500, "Thumbnail upload failed")
            updateData.thumbnailUrl = thumbnailUpload.secure_url
    }

    const updatedVideo = await Video.findbyIdandUpdate(videoId, {$set: updateData}, {new: true})

    if(!updatedVideo) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json (new ApiResponse(200, updateVideo, "video updated successfully"))
})

//Delete a video
//only admin and video owner can delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    //delete from cloudinary too
    if(video.videoUrl) await deleteFromCloudinary(video.videoUrl)
    if(video.thumbnailUrl) await deleteFromCloudinary(video.thumbnailUrl)

    await video.deleteOne()

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"))
})


// toggle publish status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(new ApiResponse(200, video, "Publish status updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}