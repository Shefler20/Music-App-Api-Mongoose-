import mongoose from "mongoose";
import Album from "./Album";

const Schema = mongoose.Schema;

const trackSchema = new Schema({
    album: {
        type: Schema.Types.ObjectId,
        ref: "Album",
        required: true,
        validate: {
            validator: async (value: mongoose.Schema.Types.ObjectId)=> Boolean(await Album.findById(value)),
            message: "Album does not exist",
        }
    },
    name: {
        type: String,
        required: true,
    },
    timeout: {
        type: String,
        required: true,
    }
});

const Track = mongoose.model("Track", trackSchema);
export default Track;