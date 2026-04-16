import mongoose from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    role: string;
    token: string;
    googleID?: string;
    avatar?: string;
    displayName: string;
}

export interface PopulatedTrack {
    _id: mongoose.Types.ObjectId;
    album: {
        _id: mongoose.Types.ObjectId;
        artist: mongoose.Types.ObjectId;
    };
}