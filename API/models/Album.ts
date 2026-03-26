import mongoose from "mongoose";
import Artist from "./Artist";

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
        validate: {
            validator: async (artistID: mongoose.Schema.Types.ObjectId) => Boolean(await Artist.findById(artistID)),
            message: "Artist does not exist",
        }
    },
    name: {
        type: String,
        required: true,
    },
    date_at: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: null,
    }
});

const Album = mongoose.model("Album", AlbumSchema);
export default Album;