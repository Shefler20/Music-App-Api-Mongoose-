import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res,next) => {
    const existingUser = await User.findOne({username: req.body.username});
    if (existingUser) return res.status(400).send({
        errors: {
            username: {
                message: "User already exists",
            },
        },
    });
    try {
       const newUser = new User({
           username: req.body.username,
           password: req.body.password,
       });
       newUser.generateAuthToken();
        const saveUser = await newUser.save();

        res.cookie("token", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

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
        const saveUser = await user.save();

        res.cookie("token", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.send({message:"Session created", user});
    }catch(e){
        next(e);
    }
});

usersRouter.delete('/sessions', auth, async (req, res,next) => {
    const {user} = req as RequestWithUser;

    user.token = '';
    await user.save();

    res.clearCookie("token",
        {
            httpOnly: true,
            sameSite: "strict",
        });

    res.send({message:"Session deleted"});
});

export default usersRouter;