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