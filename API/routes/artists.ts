import express from "express";
import Artist from "../models/Artist";
import mongoose from "mongoose";
import {imagesUpload} from "../multer";

const artistsRouter = express.Router();

artistsRouter.get("/", async (_req, res,next) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    }catch (error) {
        next(error);
    }
});

artistsRouter.post("/",imagesUpload.single("image"), async (req, res,next) => {
    try {
        const existingName = await Artist.findOne({name: req.body.name});
        if (existingName) return res.status(400).send({message: "This name is already exist"});

        const newArtist = new Artist({
            name: req.body.name,
            description: req.body.description,
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
})

export default artistsRouter;