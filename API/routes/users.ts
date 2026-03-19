import express from "express";
import mongoose from "mongoose";
import User from "../models/Users";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res,next) => {
    const existingUser = await User.findOne({username: req.body.username});
    if (existingUser) return res.status(400).send({message:"User already exists"});
    try {
       const newUser = new User({
           username: req.body.username,
           password: req.body.password,
       });
       newUser.generateAuthToken();
       await newUser.save();
       res.send(newUser);
   } catch (e) {
       if (e instanceof mongoose.Error.ValidationError) {
           return res.status(400).send(e);
       }
       next(e);
   }
});

export default usersRouter;