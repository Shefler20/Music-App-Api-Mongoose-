import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {isAxiosError} from "axios";
import {toast} from "react-toastify";

interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
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

        builder.addCase(login.pending, (state) => {
            state.loginLoading = true;
            state.loginError = null;
        })
        builder.addCase(login.fulfilled, (state, {payload: user}) => {
            state.loginLoading = false;
            state.user = user;
        })
        builder.addCase(login.rejected, (state, {payload: error}) => {
            state.loginLoading = false;
            state.loginError = error || null;
        })
    }
});

export const register = createAsyncThunk<User, RegisterMutation, {rejectValue: ValidationError}>(
    'user/register',
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

export const login = createAsyncThunk<User, LoginMutation, {rejectValue: GlobalError}>(
    'user/login',
    async (loginMutation, {rejectWithValue}) => {
        try {
            const resp = await axiosApi.post<{user: User, message: string}>('/users/sessions', loginMutation);
            toast.success(resp.data.message);
            return resp.data.user;
        }catch (e){
            if (isAxiosError(e) && e.response && e.response.status === 400){
                return rejectWithValue(e.response.data as GlobalError);
            }
            throw e;
        }
    }
);

export const userReducer = usersSlice.reducer;