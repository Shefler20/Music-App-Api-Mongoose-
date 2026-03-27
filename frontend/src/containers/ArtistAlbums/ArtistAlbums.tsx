
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {allAlbumsSelector, loadingAlbumSelector} from "../../features/albums/albumsSelectors.ts";
import {useEffect} from "react";
import {getAlbum} from "../../features/albums/albumsSlice.ts";
import {Box, Card, CardMedia, LinearProgress, Typography} from "@mui/material";
import {NavLink, useSearchParams} from "react-router-dom";
import {BASE_URL, NO_IMAGE} from "../../globalConst.ts";


const ArtistAlbums = () => {
    const [searchParams] = useSearchParams();

    const artistId = searchParams.get("artist");
    const dispatch = useAppDispatch();
    const albums = useAppSelector(allAlbumsSelector);
    const loadingAlbum = useAppSelector(loadingAlbumSelector);

    useEffect(() => {
        dispatch(getAlbum(artistId || undefined));
    }, [dispatch, artistId]);

    return (
        <>
            {loadingAlbum && <LinearProgress />}
            {!loadingAlbum && albums.length > 0 && (
                <>
                    <Typography variant="h3" color="textSecondary">
                        {artistId ? albums[0].artist.name : 'Album'}
                    </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
                            {albums.map((album) => (
                                <Card key={album._id}
                                      sx={{ width: 220, textDecoration: 'none', color: 'inherit' }}
                                      component={NavLink}
                                      to={`/tracks?album=${album._id}`}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={album.image ? BASE_URL + album.image : NO_IMAGE}
                                    />
                                    <Typography>{album.name}</Typography>
                                    <Typography>{album.date_at}</Typography>
                                </Card>
                            ))}
                        </Box>
                </>
            )}
        </>
    );
};

export default ArtistAlbums;