import type {RootState} from "../../app/store/store.ts";

export const allAlbumsSelector = (state: RootState) => state.album.albums;
export const loadingAlbumSelector = (state: RootState) => state.album.loading;