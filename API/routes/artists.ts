import express from "express";
import Artist from "../models/Artist";
import mongoose from "mongoose";
import {imagesUpload} from "../middleware/multer";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";

const artistsRouter = express.Router();

artistsRouter.get("/", async (_req, res,next) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    }catch (error) {
        next(error);
    }
});

artistsRouter.get("/my", auth, async (req, res, next) => {
    try {
        const { user } = req as RequestWithUser;

        const artists = await Artist.find({ user: user._id });

        res.send(artists);
    } catch (e) {
        next(e);
    }
});

artistsRouter.post("/",auth ,imagesUpload.single("image"), async (req, res,next) => {
    const { user } = req as RequestWithUser;
    try {
        const existingName = await Artist.findOne({name: req.body.name});
        if (existingName) return res.status(400).send({message: "This name is already exist"});

        const newArtist = new Artist({
            user: user._id,
            name: req.body.name,
            description: req.body?.description?.trim() || null,
            image: req.file ? 'images/' + req.file.filename : null,
        });
        await newArtist.save();
        res.send(newArtist);
    }catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error);
        }
        next(error);
    }
});

artistsRouter.delete("/:id",auth , async (req,res,next) => {
    const { id } = req.params;
    const { user } = req as RequestWithUser;

    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid artist id"});
    try {
        const artist = await Artist.findById(id);

        if (!artist) return res.status(404).send({message: "Artist not found"});

        if (user.role === "admin") {
            await artist.deleteOne();
            return res.send({message: "Artist has been deleted successfully"});
        }

        const isUserArtist = artist.user.toString() === user._id.toString();

        if(!isUserArtist) return res.status(403).send({message: "Forbidden"});

        await artist.deleteOne();

        res.send({message: "Artist has been deleted successfully"});
    }catch (error) {
        next(error);
    }
});

artistsRouter.patch("/:id/togglePublished",auth, permit("admin") , async (req,res,next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) return res.status(400).send({message: "Invalid artist id"});
    try {
        const artist = await Artist.findById(id);
        if (!artist) return res.status(404).send({message: "Artist not found"});

        artist.isPublished = !artist.isPublished;
        await artist.save();
        res.send({message: "Artist status updated"});
    }catch (error) {
        next(error);
    }
});

export default artistsRouter;