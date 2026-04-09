import type {RootState} from "../../app/store/store.ts";


export const tracksSelector = (state: RootState) => state.track.tracks;
export const loadingTracksSelector = (state: RootState) => state.track.loading;
export const loadingAddTracksSelector = (state: RootState) => state.track.loadingAdd;
export const loadingDeleteTracksSelector = (state: RootState) => state.track.loadingDelete;
export const loadingEditTracksSelector = (state: RootState) => state.track.loadingEdit;