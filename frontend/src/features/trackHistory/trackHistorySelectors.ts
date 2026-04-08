import type {RootState} from "../../app/store/store.ts";


export const SelectorGetTrackHistory = (state: RootState) => state.trackHistory.tracks;
export const SelectorLoadingGetTrackHistory = (state: RootState) => state.trackHistory.loading.get;
export const SelectorLoadingSendTrackHistory = (state: RootState) => state.trackHistory.loading.send;
export const SelectorErrorTrackHistory = (state: RootState) => state.trackHistory.errorGlob;