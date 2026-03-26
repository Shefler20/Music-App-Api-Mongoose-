import express from "express";
import Album from "../models/Album";
import mongoose from "mongoose";
import {imagesUpload} from "../multer";

const albumsRouter = express.Router();

albumsRouter.get("/", async (req , res, next ) => {
    const queryID = req.query.artist ? req.query.artist.toString() : null;
    if (queryID && !mongoose.Types.ObjectId.isValid(queryID)) {
        return res.status(400).send({message: "Invalid query Artist ID"});
    }
    try {
        if (!queryID) {
            const albums = await Album.find().sort({ date_at: -1 });
            return res.send(albums);
        }
        const oneArtistAlbums = await Album.find({artist: queryID}).sort({ date_at: -1 }).populate('artist');
        res.send(oneArtistAlbums);
    }catch (err) {
        next(err);
    }
});

albumsRouter.get("/:id", async (req , res, next ) => {
    const {id} = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({message: "Invalid id"});
    }
    try {
        const oneAlbum = await Album.findById(id).populate("artist");
        if (!oneAlbum) {
            return res.status(404).send({message: "Album not found"});
        }
        res.send(oneAlbum);
    }catch (err) {
        next(err);
    }
});

albumsRouter.post("/",imagesUpload.single("image"), async (req , res, next ) => {
   try {
       const newAlbum = new Album({
           artist: req.body.artist,
           name: req.body.name,
           date_at: req.body.date_at,
           image: req.file ? "images/" + req.file.filename : null,
       });
       await newAlbum.save();
       res.send(newAlbum);
   } catch (error) {
       if (error instanceof mongoose.Error.ValidationError) {
           return res.status(400).send(error);
       }
       next(error);
   }
});

export default albumsRouter;