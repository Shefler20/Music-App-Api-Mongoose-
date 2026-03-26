import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";

interface artistsState {
    artists: Artist[];
    loading: boolean;
}

export const initialState: artistsState = {
    artists: [],
    loading: false,
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
    }
});

export const getAllArtists = createAsyncThunk<Artist[], void>(
    'artist/getAllArtists',
    async () => {
        const res = await axiosApi<Artist[]>('/artists');
        return res.data;
    }
);

export const artistsReducer = artistsSlice.reducer;