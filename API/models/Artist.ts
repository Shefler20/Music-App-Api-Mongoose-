import mongoose from "mongoose";
import Album from "./Album";
import Track from "./Track";
import TrackHistory from "./TrackHistory";

const Schema = mongoose.Schema;

const artistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    }
});

artistSchema.pre("findOneAndDelete", async function () {
    const artist = await this.model.findOne(this.getFilter());

    if (!artist) return;

    const artistId = artist._id;

    const albums = await Album.find({ artist: artistId });
    const albumIds = albums.map(a => a._id);

    const tracks = await Track.find({ album: { $in: albumIds } });
    const trackIds = tracks.map(t => t._id);

    await TrackHistory.deleteMany({
        $or: [
            { artist: artistId },
            { track: { $in: trackIds } }
        ]
    });

    await Track.deleteMany({ album: { $in: albumIds } });

    await Album.deleteMany({ artist: artistId });
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;