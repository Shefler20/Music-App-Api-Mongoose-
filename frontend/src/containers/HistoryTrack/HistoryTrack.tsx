import {Box, LinearProgress, List, ListItem, ListItemText, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    SelectorGetTrackHistory,
    SelectorLoadingGetTrackHistory
} from "../../features/trackHistory/trackHistorySelectors.ts";
import {useEffect} from "react";
import {getTrackHistoryOfOneUser} from "../../features/trackHistory/trackHostorySlice.ts";
import dayjs from "dayjs";


const HistoryTrack = () => {
    const dispatch = useAppDispatch();
    const tracks = useAppSelector(SelectorGetTrackHistory);
    const loadingGetTracks = useAppSelector(SelectorLoadingGetTrackHistory);

    useEffect(() => {
        dispatch(getTrackHistoryOfOneUser());
    }, [dispatch]);
    return (
        <>
            <Box>
                {loadingGetTracks && <LinearProgress />}
                {!loadingGetTracks && tracks.length === 0 && <Typography variant={"h5"} sx={{mt: 2, textAlign: "center"}}>No track history yet</Typography>}
                <List>
                    {tracks.length > 0 && tracks.map((item) => (
                        <ListItem key={item._id} divider>
                            <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <ListItemText
                                        primary={item.track?.name}
                                        secondary={
                                            item.artist?.name
                                                ? `Artist: ${item.artist.name}`
                                                : "Unknown artist"
                                        }
                                    />
                                </Box>

                                <Box textAlign="right">
                                    <Typography variant="body2">
                                        {dayjs(item.datetime).format("DD.MM.YYYY HH:mm")}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );
};

export default HistoryTrack;