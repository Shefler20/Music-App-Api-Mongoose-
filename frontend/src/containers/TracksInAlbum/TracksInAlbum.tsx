import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {loadingTracksSelector, tracksSelector} from "../../features/tracks/tracksSelectors.ts";
import {deleteTracks, getTracks, isPublishedTracks} from "../../features/tracks/tracksSlice.ts";
import {Box, Button, LinearProgress, List, ListItem, ListItemText, Typography} from "@mui/material";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {addTrackHistory} from "../../features/trackHistory/trackHostorySlice.ts";
import {userSelector} from "../../features/users/usersSelectors.ts";


const TracksInAlbum = () => {
    const [searchID] = useSearchParams();
    const idAlbum = searchID.get("album");

    const dispatch = useAppDispatch();
    const tracks = useAppSelector(tracksSelector);
    const loadingTracks = useAppSelector(loadingTracksSelector);
    const user = useAppSelector(userSelector);
    const isAdmin = user?.role === "admin";

    const visibleTracks = tracks.filter((track) => {
        const ownerId = track.album.artist.user._id;

        if (!user) return track.isPublished;

        if (isAdmin) return true;

        return track.isPublished || ownerId === user._id;
    });

    const onDeleteAlbum  = async (id: string) => {
        await dispatch(deleteTracks({ id }));
        if (idAlbum) {
            await dispatch(getTracks(idAlbum));
        }
    }
    const onPublishAlbum = async (id :string) => {
        await dispatch(isPublishedTracks({ id }));
        if (idAlbum) {
            await dispatch(getTracks(idAlbum));
        }
    }

    useEffect(() => {
        if (idAlbum) {
            dispatch(getTracks(idAlbum));
        }
    }, [idAlbum, dispatch]);

    const artist = tracks[0]?.album?.artist?.name;
    const albumName = tracks[0]?.album?.name;
    return (
        <>
            {loadingTracks && <LinearProgress />}
            {visibleTracks.length === 0 && <Typography variant="h6" sx={{mt:3, textAlign: "center"}}>No Tracks yet</Typography>}
            {!loadingTracks && visibleTracks.length > 0 && (
                <>
                    <Typography variant="h5" component="div">
                        {artist || "Tracks"}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {albumName ? `(${albumName})` : "(Album)"}
                    </Typography>
                    <List>
                        {visibleTracks.map((track) => {
                            const ownerId = track.album.artist.user._id;

                            const isOwner = !!user && ownerId === user._id;

                            const showNotPublished = !track.isPublished && (isOwner || isAdmin);

                            return (
                                <ListItem key={track._id} divider>
                                    <Box display="flex" width="100%" alignItems="center">

                                        <Typography sx={{ width: 30 }}>
                                            {track.track_count}
                                        </Typography>

                                        <ListItemText
                                            primary={track.name}
                                            sx={{ ml: 2 }}
                                        />

                                        {showNotPublished && (
                                            <Typography
                                                sx={{
                                                    color: "red",
                                                    fontSize: 12,
                                                    mr: 2
                                                }}
                                            >
                                                Not published
                                            </Typography>
                                        )}

                                        {isAdmin && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => onDeleteAlbum(track._id)}
                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => onPublishAlbum(track._id)}
                                                >
                                                    {track.isPublished ? "Unpublish" : "Publish"}
                                                </Button>
                                            </Box>
                                        )}

                                        <IconButton
                                            onClick={() =>
                                                dispatch(
                                                    addTrackHistory({
                                                        idTrack: track._id
                                                    })
                                                )
                                            }
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>

                                        <Typography sx={{ ml: 2 }}>
                                            {track.timeout}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                </>
            )}
        </>
    );
};

export default TracksInAlbum;