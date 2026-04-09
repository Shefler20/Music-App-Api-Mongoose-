import express from "express";
import mongoose from "mongoose";
import Track from "../models/Track";
import auth, {RequestWithUser} from "../middleware/auth";
import Album from "../models/Album";
import Artist from "../models/Artist";
import permit from "../middleware/permit";

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

tracksRouter.delete("/:id",auth , async (req,res,next) => {
    const { id } = req.params;
    const { user } = req as RequestWithUser;

    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid track id"});
    try {
        const track = await Track.findById(id);
        if (!track) return res.status(404).send({message: "Track not found"});
        const album = await Album.findById(track.album);
        if (!album) return res.status(404).send({message: "Album not found"});
        const artist = await Artist.findById(album.artist);
        if (!artist) return res.status(404).send({message: "Artist not found"});

        if (user.role === "admin") {
            await track.deleteOne();
            return res.send({message: "Track has been deleted successfully"});
        }

        const isUserTrack = artist.user.toString() === user._id.toString();

        if(!isUserTrack) return res.status(403).send({message: "Forbidden"});

        await track.deleteOne();

        res.send({message: "Track has been deleted successfully"});
    }catch (error) {
        next(error);
    }
});

tracksRouter.patch("/:id/togglePublished",auth, permit("admin") , async (req,res,next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid Track id"});
    try {
        const track = await Track.findById(id);
        if (!track) return res.status(404).send({message: "Track not found"});

        track.isPublished = !track.isPublished;
        await track.save();
        res.send({message: "Track status updated"});
    }catch (error) {
        next(error);
    }
});

export default tracksRouter;