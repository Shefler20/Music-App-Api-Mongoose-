import express from "express";
import Track from "../models/Track";
import TrackHistory from "../models/TrackHistory";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import {PopulatedTrack} from "../types";

const trackHistoryRouter = express.Router();

trackHistoryRouter.post("/",auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;
        const { track } = req.body || {};

        if (!track) {
            return res.status(400).send({ message: "track is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(track)) return res.status(400).send({message:"Invalid Track"});

        const existingTrack = await Track.findById(track).populate("album") as PopulatedTrack | null;
        if (!existingTrack || !existingTrack.album) return res.status(400).send({message:"No Track or album found"});

        const newTrackHistory = new TrackHistory({
            user: user._id,
            track,
            artist: existingTrack.album.artist,
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

trackHistoryRouter.get("/",auth, async (req, res, next) => {
    const {user} = req as RequestWithUser;
    try {
        const trackHistory = await TrackHistory.find({user: user._id})
            .populate("track")
            .populate("artist")
            .sort({ datetime: -1 });

        res.send(trackHistory);
    }catch (error) {
        next(error);
    }
});

export default trackHistoryRouter;