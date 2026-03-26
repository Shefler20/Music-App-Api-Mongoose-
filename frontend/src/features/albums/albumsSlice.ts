import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";

interface albumsState {
    albums: Album[];
    loading: boolean;
}

export const initialState: albumsState = {
    albums: [],
    loading: false,
}

export const albumsSlice = createSlice({
    name: 'album',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(getAlbum.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getAlbum.fulfilled, (state, {payload: albums}) => {
            state.loading = false;
            state.albums = albums;
        })
        builder.addCase(getAlbum.rejected, (state) => {
            state.loading = false;
        })
    }
});

export const getAlbum = createAsyncThunk<Album[], string | undefined>(
    'album/getAlbum',
    async (id) => {
        const urlID = id ? `/albums?artist=${id}` : '/albums';
        const res = await axiosApi<Album[]>(urlID);
        return res.data;
    }
);

export const albumsReducer = albumsSlice.reducer;