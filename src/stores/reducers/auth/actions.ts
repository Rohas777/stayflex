import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { CodeCredentials, SignInCredentials, SignUpCredentials } from "./types";

export const signIn = createAsyncThunk(
    "auth/sign-in",
    async (credentials: SignInCredentials, thunkAPI) => {
        try {
            const response = await instance.post("/auth/login", credentials);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
export const auth = createAsyncThunk(
    "auth/auth",
    async (credentials: CodeCredentials, thunkAPI) => {
        try {
            const response = await instance.post(
                "/auth/login/auth",
                credentials
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
export const signUp = createAsyncThunk(
    "auth/sign-up",
    async (userData: SignUpCredentials, thunkAPI) => {
        try {
            const response = await instance.post("/auth/register", userData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
export const activate = createAsyncThunk(
    "auth/activate",
    async (credentials: CodeCredentials, thunkAPI) => {
        try {
            const response = await instance.post("/auth/activate", credentials);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await instance.post("/auth/logout");
        return {};
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});
