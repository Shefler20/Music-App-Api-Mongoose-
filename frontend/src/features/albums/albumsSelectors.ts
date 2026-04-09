import type {RootState} from "../../app/store/store.ts";

export const allAlbumsSelector = (state: RootState) => state.album.albums;
export const loadingAlbumSelector = (state: RootState) => state.album.loading;
export const loadingAddAlbumSelector = (state: RootState) => state.album.loadingAdd;
export const loadingDeleteAlbumSelector = (state: RootState) => state.album.loadingDelete;
export const loadingEditAlbumSelector = (state: RootState) => state.album.loadingEdit;