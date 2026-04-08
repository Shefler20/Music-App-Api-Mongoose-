import mongoose from "mongoose";
import config from "./config";
import Artist from "./models/Artist";
import Album from "./models/Album";
import Track from "./models/Track";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('albums');
        await db.dropCollection('artists');
        await db.dropCollection('tracks');
    }catch(err) {
        console.error("Error dropping collections:");
    }

    const [kendrick, drake] = await Artist.create([
        {
            name: "Kendrick Lamar",
            description: "American rapper and songwriter",
            image: "/fixtures/kendrick.jpg",
        },
        {
            name: "Drake",
            description: "Canadian rapper and singer",
            image: "/fixtures/drake.jpg",
        },
    ]);

    const [damn, tpab, takeCare, nothingWasTheSame] = await Album.create([
        {
            artist: kendrick!._id,
            name: "DAMN.",
            date_at: 2017,
        },
        {
            artist: kendrick!._id,
            name: "To Pimp a Butterfly",
            date_at: 2015,
        },

        {
            artist: drake!._id,
            name: "Take Care",
            date_at: 2011,
        },
        {
            artist: drake!._id,
            name: "Nothing Was the Same",
            date_at: 2013,
        },
    ]);

    await Track.create([
        { album: damn!._id, name: "DNA.", timeout: "3:05", track_count: 1 },
        { album: damn!._id, name: "HUMBLE.", timeout: "2:57", track_count: 2 },
        { album: damn!._id, name: "LOYALTY.", timeout: "3:47", track_count: 3 },
        { album: damn!._id, name: "PRIDE.", timeout: "4:35", track_count: 4 },
        { album: damn!._id, name: "ELEMENT.", timeout: "3:28", track_count: 5 },

        { album: tpab!._id, name: "Wesley's Theory", timeout: "4:47", track_count: 1 },
        { album: tpab!._id, name: "King Kunta", timeout: "3:55", track_count: 2 },
        { album: tpab!._id, name: "Alright", timeout: "3:39", track_count: 3 },
        { album: tpab!._id, name: "The Blacker the Berry", timeout: "4:33", track_count: 4 },
        { album: tpab!._id, name: "i", timeout: "4:52", track_count: 5 },

        { album: takeCare!._id, name: "Over My Dead Body", timeout: "4:32", track_count: 1 },
        { album: takeCare!._id, name: "Headlines", timeout: "3:55", track_count: 2 },
        { album: takeCare!._id, name: "Marvin's Room", timeout: "5:47", track_count: 3 },
        { album: takeCare!._id, name: "Take Care", timeout: "4:37", track_count: 4 },
        { album: takeCare!._id, name: "HYFR", timeout: "3:27", track_count: 5 },

        { album: nothingWasTheSame!._id, name: "Tuscan Leather", timeout: "6:02", track_count: 1 },
        { album: nothingWasTheSame!._id, name: "Furthest Thing", timeout: "5:31", track_count: 2 },
        { album: nothingWasTheSame!._id, name: "Started From the Bottom", timeout: "2:54", track_count: 3 },
        { album: nothingWasTheSame!._id, name: "Hold On, We're Going Home", timeout: "3:55", track_count: 4 },
        { album: nothingWasTheSame!._id, name: "Worst Behavior", timeout: "3:52", track_count: 5 },
    ]);

    await  db.close();
};

run().catch((error) => {console.log(error);});