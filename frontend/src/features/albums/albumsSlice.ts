import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface albumsState {
    albums: Album[];
    loading: boolean;
    loadingAdd: boolean;
    loadingDelete: boolean;
    loadingEdit: boolean;
    errorAlbum: ValidationError | null;
}

export const initialState: albumsState = {
    albums: [],
    loading: false,
    loadingAdd: false,
    loadingDelete: false,
    loadingEdit: false,
    errorAlbum: null,
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

        builder.addCase(addAlbum.pending, (state) => {
            state.loadingAdd = true
            state.errorAlbum = null
        })
        builder.addCase(addAlbum.fulfilled, (state) => {
            state.loadingAdd = false
        })
        builder.addCase(addAlbum.rejected, (state, {payload: error}) => {
            state.loadingAdd = false
            state.errorAlbum = error || null;
        })

        builder.addCase(deleteAlbum.pending, (state) => {
            state.loadingDelete = true
        })
        builder.addCase(deleteAlbum.fulfilled, (state) => {
            state.loadingDelete = false
        })
        builder.addCase(deleteAlbum.rejected, (state) => {
            state.loadingDelete = false
        })

        builder.addCase(isPublishedAlbum.pending, (state) => {
            state.loadingEdit = true
        })
        builder.addCase(isPublishedAlbum.fulfilled, (state) => {
            state.loadingEdit = false
        })
        builder.addCase(isPublishedAlbum.rejected, (state) => {
            state.loadingEdit = false
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

export const addAlbum = createAsyncThunk<void ,AlbumMutation, {rejectValue: ValidationError}>(
    "album/addAlbum",
    async (albumMutation, {rejectWithValue}) => {
        try {
            const data = new FormData();

            data.append("artist", albumMutation.artist);
            data.append("date_at", albumMutation.date_at.toString());
            data.append("name", albumMutation.name);
            if (albumMutation.image) {
                data.append("image", albumMutation.image);
            }

            await axiosApi.post("/albums", data);
        }catch (e) {
            if (isAxiosError(e) && e.response && e.response.status === 400) {
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    });

export const deleteAlbum = createAsyncThunk<void , {id: string}>(
    "album/deleteAlbum",
    async ({id}) => {
        await axiosApi.delete(`/albums/${id}`);
    });

export const isPublishedAlbum = createAsyncThunk<void, {id: string}>(
    "album/isPublishedAlbum",
    async ({id}) => {
        await axiosApi.patch(`/albums/${id}/togglePublished`);
    });

export const albumsReducer = albumsSlice.reducer;