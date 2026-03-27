import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";

interface tracksState {
    tracks: Track[],
    loading: boolean,
}

export const initialState: tracksState = {
    tracks: [],
    loading: false,
}

export const tracksSlice = createSlice({
    name: 'track',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(getTracks.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getTracks.fulfilled, (state,{payload: tracks}) => {
            state.loading = false;
            state.tracks = tracks;
        })
        builder.addCase(getTracks.rejected, (state) => {
            state.loading = false;
        })
    }
});

export const getTracks = createAsyncThunk<Track[], string>(
    'track/getTracks',
    async (idAlbum) => {
        const resp = await axiosApi<Track[]>(`/tracks?album=${idAlbum}`);
        return resp.data;
    }
);

export const tracksReducer = tracksSlice.reducer;