import express from "express";
import Album from "../models/Album";
import mongoose from "mongoose";
import {imagesUpload} from "../middleware/multer";
import auth, {RequestWithUser} from "../middleware/auth";
import Artist from "../models/Artist";
import permit from "../middleware/permit";

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

albumsRouter.post("/",auth ,imagesUpload.single("image"), async (req , res, next ) => {
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

albumsRouter.delete("/:id",auth , async (req,res,next) => {
    const { id } = req.params;
    const { user } = req as RequestWithUser;

    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid album id"});
    try {
        const album = await Album.findById(id);
        if (!album) return res.status(404).send({message: "Album not found"});
        const artist = await Artist.findById(album.artist);
        if (!artist) return res.status(404).send({message: "Artist not found"});

        if (user.role === "admin") {
            await Album.findByIdAndDelete(id);

            return res.send({message: "Album has been deleted successfully"});
        }

        const isUserAlbum = artist.user.toString() === user._id.toString();

        if(!isUserAlbum) return res.status(403).send({message: "Forbidden"});

        await Album.findByIdAndDelete(id);


        res.send({message: "Album has been deleted successfully"});
    }catch (error) {
        next(error);
    }
});

albumsRouter.patch("/:id/togglePublished",auth, permit("admin") , async (req,res,next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid album id"});
    try {
        const album = await Album.findById(id);
        if (!album) return res.status(404).send({message: "Album not found"});

        album.isPublished = !album.isPublished;
        await album.save();
        res.send({message: "Album status updated"});
    }catch (error) {
        next(error);
    }
});

export default albumsRouter;