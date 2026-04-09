import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {loadingTracksSelector, tracksSelector} from "../../features/tracks/tracksSelectors.ts";
import {getTracks} from "../../features/tracks/tracksSlice.ts";
import {Box, LinearProgress, List, ListItem, ListItemText, Typography} from "@mui/material";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {addTrackHistory} from "../../features/trackHistory/trackHostorySlice.ts";


const TracksInAlbum = () => {
    const [searchID] = useSearchParams();
    const idAlbum = searchID.get("album");

    const dispatch = useAppDispatch();
    const tracks = useAppSelector(tracksSelector);
    const loadingTracks = useAppSelector(loadingTracksSelector);

    useEffect(() => {
        if (idAlbum) {
            dispatch(getTracks(idAlbum));
        }
    }, [searchID, dispatch]);

    const artist = tracks[0]?.album?.artist?.name;
    const albumName = tracks[0]?.album?.name;
    return (
        <>
            {loadingTracks && <LinearProgress />}
            {tracks.length === 0 && <Typography variant="h6" sx={{mt:3, textAlign: "center"}}>No Tracks yet</Typography>}
            {!loadingTracks && tracks.length > 0 && (
                <>
                    <Typography variant="h5" component="div">
                        {artist || "Tracks"}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {`(${albumName})`|| "(Album)"}
                    </Typography>
                    <List>
                        {tracks.map((track) => (
                            <ListItem key={track._id} divider>
                                <Box display="flex" width="100%" alignItems="center">

                                    <Typography sx={{ width: 30 }}>
                                        {track.track_count}
                                    </Typography>

                                    <ListItemText
                                        primary={track.name}
                                        sx={{ marginLeft: 2 }}
                                    />
                                    <IconButton
                                        onClick={() => dispatch(addTrackHistory({idTrack : track._id}))}
                                    >
                                        <PlayArrowIcon />
                                    </IconButton>
                                    <Typography>
                                        {track.timeout}
                                    </Typography>

                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </>
    );
};

export default TracksInAlbum;