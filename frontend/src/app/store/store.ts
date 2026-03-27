import {configureStore} from "@reduxjs/toolkit";
import {artistsReducer} from "../../features/artists/artistsSlice.ts";
import {albumsReducer} from "../../features/albums/albumsSlice.ts";
import {tracksReducer} from "../../features/tracks/tracksSlice.ts";

export const store = configureStore({
    reducer: {
        artist : artistsReducer,
        album : albumsReducer,
        track : tracksReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;