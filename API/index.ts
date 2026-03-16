import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import artistsRouter from "./routes/artists";
import albumsRouter from "./routes/albums";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/artists", artistsRouter);
app.use("/albums", albumsRouter);

const run = async () => {
    await mongoose.connect("mongodb://localhost/music-api-js30");
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    process.on("exit", () => {
        mongoose.disconnect();
    })
};

run().catch((err) => {console.log(err)});