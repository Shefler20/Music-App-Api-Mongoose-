interface RegisterMutation {
    username: string;
    password: string;
    avatar: File | null;
    displayName: string;
}

interface LoginMutation {
    username: string;
    password: string;
}

interface User {
    _id: string;
    username: string;
    token: string;
    role: string;
    googleID?: string;
    avatar?: string;
    displayName: string;
}

interface Artist {
    user: User;
    _id: string;
    name: string;
    image: string | null;
    description: string | null;
    isPublished: boolean;
}

interface ArtistMutationApi {
    name: string;
    image: File | null;
    description: string | null;
}

interface ArtistMutation {
    name: string;
    image: File | null;
    description: string;
}

interface Album {
    _id: string;
    artist: Artist;
    name: string;
    date_at: number;
    image: string | null;
    isPublished: boolean;
}

interface AlbumMutation {
    artist: string;
    name: string;
    date_at: string;
    image: File | null;
}

interface Track {
    _id: string;
    album: Album;
    name: string;
    timeout: string;
    track_count: number;
    isPublished: boolean;
}

interface TrackMutation {
    album: string;
    name: string;
    timeout: string;
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