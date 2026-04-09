import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {allAlbumsSelector, loadingAddAlbumSelector} from "../../features/albums/albumsSelectors.ts";
import {myArtistsSelector} from "../../features/artists/aristsSelectors.ts";
import {useEffect, useState} from "react";
import {getMyArtists} from "../../features/artists/artistsSlice.ts";
import * as React from "react";
import { getAlbum} from "../../features/albums/albumsSlice.ts";
import {z} from "zod";
import {addTracks} from "../../features/tracks/tracksSlice.ts";


const albumSchema = z.object({
    album: z.string().min(1, "Album is required"),
    name: z.string().trim().min(1, "Track name is required"),
    timeout: z.string().trim().min(1, "Time is required"),
});

const NewTrack = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loadingAdd = useAppSelector(loadingAddAlbumSelector);
    const artist = useAppSelector(myArtistsSelector);
    const albums = useAppSelector(allAlbumsSelector);
    const [form, setForm] = useState<TrackMutation>({
        album: "",
        name: "",
        timeout: "",
    });

    const [isArtist, setIsArtist] = useState<string>("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(getMyArtists());
    }, [dispatch]);

    const handleArtistChange = (artistId: string) => {
        setIsArtist(artistId);

        setForm(prev => ({
            ...prev,
            album: ""
        }));

        if (artistId) {
            dispatch(getAlbum(artistId));
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const result = albumSchema.safeParse(form);

            if (!result.success) {
                const fieldErrors: Record<string, string> = {};

                result.error.issues.forEach(error => {
                    const field = error.path[0];
                    if (field) {
                        fieldErrors[field as string] = error.message;
                    }
                });
                setErrors(fieldErrors);
                return;
            }

            setErrors({});
            await dispatch(addTracks(form)).unwrap();
            setForm({
                album: "",
                name: "",
                timeout: "",
            });
            navigate('/');
        }catch (e) {
            console.log(e);
        }
    };

    const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevState => ({...prevState, [name]: value}));
    }

    return (
        <>
            <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" gap={2} sx={{ mt: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id="artist-select-label">
                        Choose Artist
                    </InputLabel>

                    <Select
                        labelId="artist-select-label"
                        value={isArtist}
                        label="Choose Artist"
                        onChange={(e) => handleArtistChange(e.target.value)}
                    >
                        {artist.map(a => (
                            <MenuItem key={a._id} value={a._id}>
                                {a.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id="album-label">Album</InputLabel>
                    <Select
                        labelId="album-label"
                        name="album"
                        value={form.album}
                        label="Album"
                        onChange={(e) =>
                            setForm(prev => ({
                                ...prev,
                                album: e.target.value
                            }))
                        }
                        disabled={loadingAdd || !isArtist}
                        error={!!errors.album}
                    >
                        {albums.map((album) => (
                            <MenuItem key={album._id} value={album._id}>
                                {album.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Track name"
                    name="name"
                    value={form.name}
                    onChange={changeField}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loadingAdd}
                />

                <TextField
                    label="Time"
                    name="timeout"
                    value={form.timeout}
                    onChange={changeField}
                    rows={3}
                    disabled={loadingAdd}
                    error={!!errors.timeout}
                    helperText={errors.timeout}
                />

                <Button type="submit" variant="contained" disabled={loadingAdd}>
                    {loadingAdd ? <CircularProgress /> : 'Create Track'}
                </Button>
            </Box>
        </>
    );
};

export default NewTrack;