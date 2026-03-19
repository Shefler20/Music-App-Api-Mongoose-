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

usersRouter.post("/sessions", async (req, res,next) => {
    try{
        const user = await User.findOne({username: req.body.username});

        if (!user) return res.status(400).send({message:"User does not exist"});

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) return res.status(400).send({message:"Invalid password"});

        user.generateAuthToken();
        await user.save();
        res.send({message:"Session created"});
    }catch(e){
        next(e);
    }
});

export default usersRouter;