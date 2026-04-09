import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import FileInput from "../../UI/FileInput.tsx";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import { myArtistsSelector} from "../../features/artists/aristsSelectors.ts";
import {useEffect, useState} from "react";
import * as React from "react";
import {getMyArtists} from "../../features/artists/artistsSlice.ts";
import {z} from "zod";
import {addAlbum} from "../../features/albums/albumsSlice.ts";
import {loadingAddAlbumSelector} from "../../features/albums/albumsSelectors.ts";

const albumSchema = z.object({
    artist: z.string().min(1, "Artist is required"),
    name: z.string().trim().min(1, "Album name is required"),
    date_at: z.coerce.number().int().positive("Date is required")
});

const NewAlbum = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loadingAdd = useAppSelector(loadingAddAlbumSelector);
    const artist = useAppSelector(myArtistsSelector);
    const [form, setForm] = useState<AlbumMutation>({
        artist: "",
        name: "",
        date_at: "",
        image: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(getMyArtists());
    }, [dispatch])

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
            await dispatch(addAlbum(form)).unwrap();
            setForm({
                artist: "",
                name: "",
                date_at: "",
                image: null,
            });
            navigate('/');
        }catch (e) {
            console.log(e);
        }
    };

    const changeField = (e: React.ChangeEvent<HTMLInputElement >) => {
        const { name, value } = e.target;
        setForm(prevState => ({...prevState, [name]: value}));
    }

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files){
            setForm(prevState => ({...prevState, [name]: files[0]}));
        }
    };
    return (
        <>
            <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" gap={2} sx={{ mt: 3 }}>
                <FormControl fullWidth>
                    <InputLabel id="artist-label">Artist</InputLabel>
                    <Select
                        labelId="artist-label"
                        name="artist"
                        value={form.artist}
                        label="Artist"
                        onChange={(e) =>
                            setForm(prev => ({
                                ...prev,
                                artist: e.target.value
                            }))
                        }
                        disabled={loadingAdd}
                    >
                        {artist.map((artist) => (
                            <MenuItem key={artist._id} value={artist._id}>
                                {artist.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Album name"
                    name="name"
                    value={form.name}
                    onChange={changeField}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loadingAdd}
                />

                <TextField
                    label="Date at"
                    name="date_at"
                    value={form.date_at}
                    onChange={changeField}
                    rows={3}
                    disabled={loadingAdd}
                    error={!!errors.date_at}
                    helperText={errors.date_at}
                />


                <FileInput
                    name="image"
                    label="Image"
                    value={form.image}
                    onChange={fileInputChangeHandler}
                />
                <Button type="submit" variant="contained" disabled={loadingAdd}>
                    {loadingAdd ? <CircularProgress /> : 'Create Artist'}
                </Button>
            </Box>
        </>
    );
};

export default NewAlbum;