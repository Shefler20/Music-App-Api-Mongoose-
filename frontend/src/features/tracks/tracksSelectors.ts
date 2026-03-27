import type {RootState} from "../../app/store/store.ts";


export const tracksSelector = (state: RootState) => state.track.tracks;
export const loadingTracksSelector = (state: RootState) => state.track.loading;