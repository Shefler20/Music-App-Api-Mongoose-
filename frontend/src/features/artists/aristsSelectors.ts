import type {RootState} from "../../app/store/store.ts";


export const artistsSelector = (state: RootState) => state.artist.artists;
export const loadingArtistsSelector = (state: RootState) => state.artist.loading;
export const loadingAddArtistsSelector = (state: RootState) => state.artist.loadingAdd;
export const loadingDeleteArtistsSelector = (state: RootState) => state.artist.loadingDelete;
export const loadingEditArtistsSelector = (state: RootState) => state.artist.loadingEdit;