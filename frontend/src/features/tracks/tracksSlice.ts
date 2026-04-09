import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface tracksState {
    tracks: Track[],
    loading: boolean,
    loadingAdd: boolean;
    loadingDelete: boolean;
    loadingEdit: boolean;
    errorTrack: ValidationError | null;
}

export const initialState: tracksState = {
    tracks: [],
    loading: false,
    loadingAdd: false,
    loadingDelete: false,
    loadingEdit: false,
    errorTrack: null,
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

        builder.addCase(addTracks.pending, (state) => {
            state.loadingAdd = true
            state.errorTrack = null
        })
        builder.addCase(addTracks.fulfilled, (state) => {
            state.loadingAdd = false
        })
        builder.addCase(addTracks.rejected, (state, {payload: error}) => {
            state.loadingAdd = false
            state.errorTrack = error || null;
        })

        builder.addCase(deleteTracks.pending, (state) => {
            state.loadingDelete = true
        })
        builder.addCase(deleteTracks.fulfilled, (state) => {
            state.loadingDelete = false
        })
        builder.addCase(deleteTracks.rejected, (state) => {
            state.loadingDelete = false
        })

        builder.addCase(isPublishedTracks.pending, (state) => {
            state.loadingEdit = true
        })
        builder.addCase(isPublishedTracks.fulfilled, (state) => {
            state.loadingEdit = false
        })
        builder.addCase(isPublishedTracks.rejected, (state) => {
            state.loadingEdit = false
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

export const addTracks = createAsyncThunk<void ,TrackMutation, {rejectValue: ValidationError}>(
    "track/addTracks",
    async (trackMutation, {rejectWithValue}) => {
        try {
            await axiosApi.post("/tracks", trackMutation);
        }catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    });

export const deleteTracks = createAsyncThunk<void , {id: string}>(
    "track/deleteTracks",
    async ({id}) => {
        await axiosApi.delete(`/tracks/${id}`);
    });

export const isPublishedTracks = createAsyncThunk<void, {id: string}>(
    "track/isPublishedTracks",
    async ({id}) => {
        await axiosApi.patch(`/tracks/${id}/togglePublished`);
    });

export const tracksReducer = tracksSlice.reducer;