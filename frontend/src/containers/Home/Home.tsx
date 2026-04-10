import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {deleteArtist, getAllArtists, isPublishedArtist} from "../../features/artists/artistsSlice.ts";
import {artistsSelector, loadingArtistsSelector} from "../../features/artists/aristsSelectors.ts";
import CardAll from "../../components/CardAll/CardAll.tsx";
import {Box, LinearProgress} from "@mui/material";
import {userSelector} from "../../features/users/usersSelectors.ts";


const Home = () => {
    const dispatch = useAppDispatch();
    const artists = useAppSelector(artistsSelector);
    const loadingArtists = useAppSelector(loadingArtistsSelector);
    const user = useAppSelector(userSelector);

    const isAdmin = user?.role === "admin";

    const isOwner = (artistUserId: string) => {
        return user?._id === artistUserId;
    };

    const filteredArtists = artists.filter((artist) => {
        if (isAdmin) return true;

        if (artist.isPublished) return true;

        return artist.user._id === user?._id;
    });

    const onDeleteArtist = async (id: string) => {
        await dispatch(deleteArtist({id}));
        await dispatch(getAllArtists());
    }
    const published = async (id :string) => {
        await dispatch(isPublishedArtist({id}));
        await dispatch(getAllArtists());
    }

    useEffect(() => {
        dispatch(getAllArtists());
    }, [dispatch])
    return (
        <>
            {loadingArtists && <LinearProgress />}
            {!loadingArtists && artists.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", mt: 4 }}>
                    {filteredArtists.map((artist) => (
                        <CardAll
                            key={artist._id}
                            items={artist}
                            isAdmin={isAdmin}
                            isOwner={isOwner(artist.user._id)}
                            onDelete={onDeleteArtist}
                            published={published}
                        />
                    ))}
                </Box>
            )}
        </>
    );
};

export default Home;