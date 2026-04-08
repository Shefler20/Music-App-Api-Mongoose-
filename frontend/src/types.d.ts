interface RegisterMutation {
    username: string;
    password: string;
}

interface LoginMutation {
    username: string;
    password: string;
}

interface User {
    _id: string;
    username: string;
    token: string;
}

interface Artist {
    _id: string;
    name: string;
    image: string | null;
    description: string | null;
}

interface Album {
    _id: string;
    artist: Artist;
    name: string;
    date_at: number;
    image: string | null;
}

interface Track {
    _id: string;
    album: Album;
    name: string;
    timeout: string;
    track_count: number;
}

interface TrackHistory {
    _id: string;
    user: User;
    track: Track;
    artist: Artist;
    datetime: Date;
}

interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

interface GlobalError {
    message: string;
}