import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import {imagesUpload} from "../middleware/multer";

const usersRouter = express.Router();

usersRouter.post("/", imagesUpload.single("image"), async (req, res,next) => {
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
           displayName: req.body.displayName,
           avatar: req.file ? "images/" + req.file.filename : null,
       });
       newUser.generateAuthToken();
        const saveUser = await newUser.save();

        res.cookie("token", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.send(saveUser);
   } catch (e) {
       if (e instanceof mongoose.Error.ValidationError) {
           return res.status(400).send(e);
       }
       next(e);
   }
});


usersRouter.post("/google", async (req, res,next) => {
    try {
        if (!req.body.credential) return res.status(400).send({message: "Credential required"});
        const client = new OAuth2Client(config.clientID);

        console.log(config.clientID)
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.clientID
        });

        const payload = ticket.getPayload();

        if (!payload) return res.status(400).send({message: "Invalid Credential"});

        const email = payload.email;
        const displayName = payload.name;
        const avatar = payload.picture;
        const id = payload.sub;

        if (!email) return res.status(400).send({message: "Not enough email address of google"});

        let user = await User.findOne({googleID: id});

        if (!user) {
            user = new User({
                username: email,
                googleID: id,
                displayName,
                avatar,
                password: crypto.randomUUID()
            });
        }
        user.generateAuthToken();
        const saveUser = await user.save();

        res.cookie("token", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.send({message: "Successfully logged with Google", user});
    }catch (e) {
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

usersRouter.delete('/sessions', auth, async (req, res) => {
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