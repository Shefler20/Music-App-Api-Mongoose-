import {Box, Button, CircularProgress, TextField} from "@mui/material";
import FileInput from "../../UI/FileInput.tsx";
import {useState} from "react";
import * as React from "react";
import { z } from "zod";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {addArtist} from "../../features/artists/artistsSlice.ts";
import {useNavigate} from "react-router-dom";
import {loadingAddArtistsSelector} from "../../features/artists/aristsSelectors.ts";

const artistSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
});

const NewArtist = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loadingAdd = useAppSelector(loadingAddArtistsSelector);
    const [form, setForm] = useState<ArtistMutation>({
        name: "",
        image: null,
        description: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const preparedData = {
            ...form,
            description: form.description.trim() || null,
        };
        try {
            const result = artistSchema.safeParse(preparedData);

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
            await dispatch(addArtist(preparedData)).unwrap();
            setForm({
                name: "",
                image: null,
                description: "",
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

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files){
            setForm(prevState => ({...prevState, [name]: files[0]}));
        }
    };
    return (
        <>
            <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" gap={2} sx={{ mt: 3 }}>
                <TextField
                    label="Artist name"
                    name="name"
                    value={form.name}
                    onChange={changeField}
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loadingAdd}
                />

                <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={changeField}
                    multiline
                    rows={3}
                    disabled={loadingAdd}
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

export default NewArtist;