import mongoose, {Schema, trusted} from "mongoose";

const playlistSchema = new Schema(
    {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
    }, {timestamps:true}
)


export const Playlist = mongoose.model("playlist", playlistSchema)