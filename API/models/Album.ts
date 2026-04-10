import mongoose from "mongoose";
import Artist from "./Artist";
import Track from "./Track";
import TrackHistory from "./TrackHistory";

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
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    }
});

AlbumSchema.pre("findOneAndDelete", async function () {
    const album = await this.model.findOne(this.getFilter());

    if (!album) return;

    const albumId = album._id;

    const tracks = await Track.find({ album: { $in: albumId } });
    const trackIds = tracks.map(t => t._id);

    await TrackHistory.deleteMany({
        $or: [
            { artist: albumId },
            { track: { $in: trackIds } }
        ]
    });

    await Track.deleteMany({ album: { $in: albumId } });
});

const Album = mongoose.model("Album", AlbumSchema);
export default Album;