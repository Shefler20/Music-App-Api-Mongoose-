import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {isAxiosError} from "axios";
import axiosApi from "../../axiosApi.ts";

interface trackHistoryState {
    tracks: TrackHistory[];
    loading: {
        get: boolean;
        send: boolean;
    }
    errorGlob: GlobalError | null;
}

export const initialState: trackHistoryState = {
    tracks: [],
    loading: {
        get: false,
        send: false,
    },
    errorGlob: null,
};

export const trackHistorySlice = createSlice({
    name: "trackHistory",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(addTrackHistory.pending, (state) => {
            state.loading.send = true;
            state.errorGlob = null;
        })
        builder.addCase(addTrackHistory.fulfilled, (state) => {
            state.loading.send = false;
        })
        builder.addCase(addTrackHistory.rejected, (state, {payload: error}) => {
            state.loading.send = false;
            state.errorGlob = error || null;
        })

        builder.addCase(getTrackHistoryOfOneUser.pending, (state) => {
            state.loading.get = true;
        })
        builder.addCase(getTrackHistoryOfOneUser.fulfilled, (state, {payload: tracks}) => {
            state.loading.get = false;
            state.tracks = tracks;
        })
        builder.addCase(getTrackHistoryOfOneUser.rejected, (state) => {
            state.loading.get = false;
        })
    }
});

export const addTrackHistory = createAsyncThunk<void , {idTrack: string}, {rejectValue: GlobalError}>(
    "trackHistory/addTrackHistory",
    async ({idTrack}, {rejectWithValue}) => {
        try {
            await axiosApi.post("/track_history", { track: idTrack });
        }catch ( e ) {
            if (isAxiosError(e) && e.response && e.response.status === 400 ) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    });

export const getTrackHistoryOfOneUser = createAsyncThunk<TrackHistory[], void>(
    "trackHistory/getTrackHistoryOfOneUser",
    async () => {
            const tracks = await axiosApi<TrackHistory[]>("/track_history");
            return tracks.data;
    });

export const trackHistoryReducer = trackHistorySlice.reducer;
