import mongoose from "mongoose";

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

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;