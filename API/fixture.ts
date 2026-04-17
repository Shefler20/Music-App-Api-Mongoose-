import mongoose from "mongoose";
import config from "./config";
import Artist from "./models/Artist";
import Album from "./models/Album";
import Track from "./models/Track";
import User from "./models/User";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection('albums');
        await db.dropCollection('artists');
        await db.dropCollection('tracks');
    }catch(err) {
        console.error("Error dropping collections:");
    }

    const [admin, user] = await User.create([
        {
            username: "admin",
            password: "123",
            role: "admin",
            displayName: "Admin",
        },
        {
            username: "user",
            password: "123",
            role: "user",
            displayName: "User",
        },
    ]);

    const [kendrick, drake, metro] = await Artist.create([
        {
            name: "Kendrick Lamar",
            description: "American rapper and songwriter",
            image: "/fixtures/kendrick.jpg",
            isPublished: true,
            user: user!._id,
        },
        {
            name: "Drake",
            description: "Canadian rapper and singer",
            image: "/fixtures/drake.jpg",
            isPublished: true,
            user: user!._id,
        },
        {
            name: "Metro Boomin",
            description: "American record producer and DJ",
            image: "/fixtures/metro.jpg",
            isPublished: false,
            user: admin!._id,
        }
    ]);

    const [damn, tpab, takeCare, nothingWasTheSame, Nothing] = await Album.create([
        {
            artist: kendrick!._id,
            name: "DAMN.",
            date_at: 2017,
            isPublished: true,
        },
        {
            artist: kendrick!._id,
            name: "To Pimp a Butterfly",
            date_at: 2015,
            isPublished: true,
        },

        {
            artist: drake!._id,
            name: "Take Care",
            date_at: 2011,
            isPublished: true,
        },
        {
            artist: drake!._id,
            name: "Nothing Was the Same",
            date_at: 2013,
            isPublished: true,
        },
        {
            artist: metro!._id,
            name: "Heroes & Villains",
            date_at: 2022,
            isPublished: false,
        }
    ]);

    await Track.create([
        { album: damn!._id, name: "DNA.", timeout: "3:05", track_count: 1, isPublished: true },
        { album: damn!._id, name: "HUMBLE.", timeout: "2:57", track_count: 2 , isPublished: true},
        { album: damn!._id, name: "LOYALTY.", timeout: "3:47", track_count: 3 , isPublished: true},
        { album: damn!._id, name: "PRIDE.", timeout: "4:35", track_count: 4 , isPublished: true},
        { album: damn!._id, name: "ELEMENT.", timeout: "3:28", track_count: 5 , isPublished: true},

        { album: tpab!._id, name: "Wesley's Theory", timeout: "4:47", track_count: 1 , isPublished: true},
        { album: tpab!._id, name: "King Kunta", timeout: "3:55", track_count: 2 , isPublished: true},
        { album: tpab!._id, name: "Alright", timeout: "3:39", track_count: 3 , isPublished: true},
        { album: tpab!._id, name: "The Blacker the Berry", timeout: "4:33", track_count: 4, isPublished: true },
        { album: tpab!._id, name: "i", timeout: "4:52", track_count: 5 , isPublished: true},

        { album: takeCare!._id, name: "Over My Dead Body", timeout: "4:32", track_count: 1 , isPublished: true},
        { album: takeCare!._id, name: "Headlines", timeout: "3:55", track_count: 2 , isPublished: true},
        { album: takeCare!._id, name: "Marvin's Room", timeout: "5:47", track_count: 3 , isPublished: true},
        { album: takeCare!._id, name: "Take Care", timeout: "4:37", track_count: 4 , isPublished: true},
        { album: takeCare!._id, name: "HYFR", timeout: "3:27", track_count: 5 , isPublished: true},

        { album: nothingWasTheSame!._id, name: "Tuscan Leather", timeout: "6:02", track_count: 1 , isPublished: true},
        { album: nothingWasTheSame!._id, name: "Furthest Thing", timeout: "5:31", track_count: 2 , isPublished: true},
        { album: nothingWasTheSame!._id, name: "Started From the Bottom", timeout: "2:54", track_count: 3 , isPublished: true},
        { album: nothingWasTheSame!._id, name: "Hold On, We're Going Home", timeout: "3:55", track_count: 4 , isPublished: true},
        { album: nothingWasTheSame!._id, name: "Worst Behavior", timeout: "3:52", track_count: 5 , isPublished: true},

        {album: Nothing!._id, name: "On Time", timeout: "2:20", track_count: 1, isPublished: false,},
        {album: Nothing!._id, name: "Superhero (Heroes & Villains)", timeout: "3:02", track_count: 2, isPublished: false,},
        {album: Nothing!._id, name: "Too Many Nights", timeout: "3:19", track_count: 3, isPublished: false,},
    ]);

    await  db.close();
};

run().catch((error) => {console.log(error);});