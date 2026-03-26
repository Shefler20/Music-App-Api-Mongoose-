import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {getAllArtists} from "../../features/artists/artistsSlice.ts";
import {artistsSelector} from "../../features/artists/aristsSelectors.ts";
import CardAll from "../../components/CardAll/CardAll.tsx";
import {Box} from "@mui/material";


const Home = () => {
    const dispatch = useAppDispatch();
    const artists = useAppSelector(artistsSelector);

    useEffect(() => {
        dispatch(getAllArtists());
    }, [dispatch])
    return (
        <>
            {artists.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 4 }}>
                    {artists.map((artist) => (
                        <CardAll key={artist._id} items={artist} />
                    ))}
                </Box>
            )}
        </>
    );
};

export default Home;