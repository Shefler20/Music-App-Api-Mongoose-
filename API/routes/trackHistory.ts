import express from "express";
import Track from "../models/Track";
import TrackHistory from "../models/TrackHistory";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";

const trackHistoryRouter = express.Router();

trackHistoryRouter.post("/",auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        if (!mongoose.Types.ObjectId.isValid(req.body.track)) return res.status(400).send({message:"Invalid Track"});

        const existingTrack = await Track.findById(req.body.track);
        if (!existingTrack) return res.status(400).send({message:"No Track found"});

        const newTrackHistory = new TrackHistory({
            user: user._id,
            track: existingTrack._id,
        });
        await newTrackHistory.save();
        res.send({message:"Session created", trackHistory: newTrackHistory});
    }catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({message:error});
        }
        next(error);
    }
});

export default trackHistoryRouter;