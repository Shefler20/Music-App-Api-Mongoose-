
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {allAlbumsSelector, loadingAlbumSelector} from "../../features/albums/albumsSelectors.ts";
import {useEffect} from "react";
import {deleteAlbum, getAlbum, isPublishedAlbum} from "../../features/albums/albumsSlice.ts";
import {Box, Button, Card, CardMedia, LinearProgress, Typography} from "@mui/material";
import {NavLink, useSearchParams} from "react-router-dom";
import {BASE_URL, NO_IMAGE} from "../../globalConst.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";


const ArtistAlbums = () => {
    const [searchParams] = useSearchParams();

    const artistId = searchParams.get("artist");
    const dispatch = useAppDispatch();
    const albums = useAppSelector(allAlbumsSelector);
    const loadingAlbum = useAppSelector(loadingAlbumSelector);
    const user = useAppSelector(userSelector);

    const isAdmin = user?.role === "admin";


    const onDeleteAlbum  = async (id: string) => {
        await dispatch(deleteAlbum({ id }));
        await dispatch(getAlbum(artistId || undefined));
    }
    const onPublishAlbum = async (id :string) => {
        await dispatch(isPublishedAlbum({ id }));
        await dispatch(getAlbum(artistId || undefined));
    }

    const filteredAlbums = albums.filter((album) => {
        const ownerId = album.artist?.user?._id;

        if (!user) {
            return album.isPublished;
        }

        if (user.role === "admin") {
            return true;
        }

        return album.isPublished || ownerId === user._id;
    });


    useEffect(() => {
        dispatch(getAlbum(artistId || undefined));
    }, [dispatch, artistId]);

    return (
        <>
            {loadingAlbum && <LinearProgress />}
            {filteredAlbums.length === 0 && <Typography variant="h6" sx={{mt:3, textAlign: "center"}}>No Albums yet</Typography>}
            {!loadingAlbum && filteredAlbums.length > 0 && (
                <>
                    <Typography variant="h3" color="textSecondary">
                        {artistId ? albums[0].artist.name : 'Album'}
                    </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 4 }}>
                            {filteredAlbums.map((album) => {
                                const ownerId = album.artist?.user?._id;

                                const isOwner = !!user && ownerId === user._id;

                                const showNotPublished = !album.isPublished && (isOwner || isAdmin);
                                return (
                                    <Card
                                        key={album._id}
                                        component={NavLink}
                                        to={`/tracks?album=${album._id}`}
                                        sx={{
                                            width: 220,
                                            position: "relative",
                                            textDecoration: "none",
                                            color: "inherit"
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={
                                                album.image
                                                    ? BASE_URL + album.image
                                                    : NO_IMAGE
                                            }
                                        />

                                        <Typography sx={{ px: 1 }}>
                                            {album.name}
                                        </Typography>

                                        <Typography sx={{ px: 1, fontSize: 12 }}>
                                            {album.date_at}
                                        </Typography>

                                        {showNotPublished && (
                                            <Typography
                                                sx={{
                                                    px: 1,
                                                    fontSize: 12,
                                                    color: "red",
                                                    fontWeight: 500
                                                }}
                                            >
                                                Not published
                                            </Typography>
                                        )}

                                        {isAdmin && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                    zIndex: 2
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onDeleteAlbum(album._id);
                                                    }}
                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onPublishAlbum(album._id);
                                                    }}
                                                >
                                                    {album.isPublished ? "Unpublish" : "Publish"}
                                                </Button>
                                            </Box>
                                        )}
                                    </Card>
                                );
                            })}
                        </Box>
                </>
            )}
        </>
    );
};

export default ArtistAlbums;