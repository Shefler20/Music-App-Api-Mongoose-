import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import artistsRouter from "./routes/artists";
import albumsRouter from "./routes/albums";
import tracksRouter from "./routes/tracks";
import usersRouter from "./routes/users";
import trackHistoryRouter from "./routes/trackHistory";
import config from "./config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const port = 8000;

dotenv.config();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/artists", artistsRouter);
app.use("/albums", albumsRouter);
app.use("/tracks", tracksRouter);
app.use("/track_history", trackHistoryRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    process.on("exit", () => {
        mongoose.disconnect();
    })
};

run().catch((err) => {console.log(err)});