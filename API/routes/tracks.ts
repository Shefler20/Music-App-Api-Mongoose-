import express from "express";
import mongoose from "mongoose";
import Track from "../models/Track";
import auth from "../middleware/auth";

const tracksRouter = express.Router();

tracksRouter.get("/",auth ,async (req, res,next) => {
   const queryID = req.query.album ? req.query.album.toString() : null;
   if (queryID && !mongoose.Types.ObjectId.isValid(queryID)) {
       return res.status(400).send({message: "Invalid query ID"});
   }
    try {
       if (!queryID) {
           const allTracks = await Track.find().populate("album").sort({ track_count: 1 });
           return res.send(allTracks);
       }
       const tracksInOneAlbum = await Track.find({album: queryID}).populate({
           path: "album",
           populate: {
               path: "artist"
           }
       }).sort({ track_count:    1 });
       res.send(tracksInOneAlbum);
   } catch (err){
       next(err);
   }
});

tracksRouter.post("/", async (req, res, next) => {
    try {
        const track = new Track({
            album: req.body.album,
            name: req.body.name,
            timeout: req.body?.timeout.trim()
        });
        await track.save();
        res.send(track);
    }catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        next(error);
    }
});

export default tracksRouter;