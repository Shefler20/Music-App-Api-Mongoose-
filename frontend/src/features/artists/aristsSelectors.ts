import type {RootState} from "../../app/store/store.ts";


export const artistsSelector = (state: RootState) => state.artist.artists;
export const loadingArtistsSelector = (state: RootState) => state.artist.loading;