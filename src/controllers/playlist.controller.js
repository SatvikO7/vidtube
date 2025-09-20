import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name) {
        throw new ApiError(400, "Playlist name is requied")
    }
    
    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        video: []
    })

    return res
        .status(201)
        .json(new ApiResponse(201, newPlaylist, "Playlist cretaed successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.find({owner : userId})

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlist fetched successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if(!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId)
        await playlist.save()
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Video added to the Playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video")
    }

    const playlist = await Playlist.findById(playlistId) 

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    playlist.videos = playlist,videos.filter(
        (id) => id.toString() !== videoId.toString()
    )

    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Video removed from the playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist id")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: {name, description} },
        {new: true}
    )

    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}