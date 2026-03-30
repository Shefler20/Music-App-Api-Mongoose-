import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";

interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
}

export const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder.addCase(register.pending, (state) => {
            state.registerLoading = true;
            state.registerError = null;
        })
        builder.addCase(register.fulfilled, (state, {payload: user}) => {
            state.registerLoading = false;
            state.user = user;
        })
        builder.addCase(register.rejected, (state, {payload: error}) => {
            state.registerLoading = false;
            state.registerError = error || null;
        })
    }
});

export const register = createAsyncThunk<User, RegisterMutation, {rejectValue: ValidationError}>(
    'users/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const resp = await axiosApi.post('/users', registerMutation);
            return resp.data;
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data);
            }
            throw e;
        }
    }
);

export const userReducer = usersSlice.reducer;