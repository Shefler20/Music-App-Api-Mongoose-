import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface artistsState {
    artists: Artist[];
    loading: boolean;
    loadingAdd: boolean;
    loadingDelete: boolean;
    loadingEdit: boolean;
    errorArtist: ValidationError | null;
}

export const initialState: artistsState = {
    artists: [],
    loading: false,
    loadingAdd: false,
    loadingDelete: false,
    loadingEdit: false,
    errorArtist: null,
}

export const artistsSlice = createSlice({
    name: 'artist',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(getAllArtists.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getAllArtists.fulfilled, (state, {payload: artists}) => {
            state.loading = false
            state.artists = artists
        })
        builder.addCase(getAllArtists.rejected, (state) => {
            state.loading = false
        })

        builder.addCase(addArtist.pending, (state) => {
            state.loadingAdd = true
            state.errorArtist = null
        })
        builder.addCase(addArtist.fulfilled, (state) => {
            state.loadingAdd = false
        })
        builder.addCase(addArtist.rejected, (state, {payload: error}) => {
            state.loadingAdd = false
            state.errorArtist = error || null;
        })

        builder.addCase(deleteArtist.pending, (state) => {
            state.loadingDelete = true
        })
        builder.addCase(deleteArtist.fulfilled, (state) => {
            state.loadingDelete = false
        })
        builder.addCase(deleteArtist.rejected, (state) => {
            state.loadingDelete = false
        })

        builder.addCase(isPublishedArtist.pending, (state) => {
            state.loadingEdit = true
        })
        builder.addCase(isPublishedArtist.fulfilled, (state) => {
            state.loadingEdit = false
        })
        builder.addCase(isPublishedArtist.rejected, (state) => {
            state.loadingEdit = false
        })
    }
});

export const getAllArtists = createAsyncThunk<Artist[], void>(
    'artist/getAllArtists',
    async () => {
        const res = await axiosApi<Artist[]>('/artists');
        return res.data;
    }
);

export const addArtist = createAsyncThunk<void ,ArtistMutationApi, {rejectValue: ValidationError}>(
    "artist/addArtist",
    async (artistMutation, {rejectWithValue}) => {
        try {
            const data = new FormData();

            data.append("name", artistMutation.name);
            if (artistMutation.image) {
                data.append("image", artistMutation.image);
            }
            if (artistMutation.description) {
                data.append("description", artistMutation.description);
            }

            await axiosApi.post("/artists", data);
        }catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    });

export const deleteArtist = createAsyncThunk<void , {id: string}>(
    "artist/deleteArtist",
    async ({id}) => {
        await axiosApi.delete(`/artists/${id}`);
    });

export const isPublishedArtist = createAsyncThunk<void, {id: string}>(
    "artist/isPablishedArtist",
    async ({id}) => {
        await axiosApi.patch(`/artists/${id}/togglePublished`);
    });

export const artistsReducer = artistsSlice.reducer;