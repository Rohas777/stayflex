import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { CodeCredentials, SignInCredentials, SignUpCredentials } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const signIn = createAsyncThunk(
    "auth/sign-in",
    async (credentials: SignInCredentials, thunkAPI) => {
        try {
            const response = await instance.post("/auth/login", credentials);
            return response.data;
        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue("Пользователь не активирован");
            }
            if (error.response.status === 406) {
                return thunkAPI.rejectWithValue("Неверный email или пароль");
            }
            if (error.response.status === 403) {
                return thunkAPI.rejectWithValue(
                    "Пользователь не верифицирован"
                );
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
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
            if (error.response.status === 403) {
                return thunkAPI.rejectWithValue("Код авторизации устарел");
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Код авторизации не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
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
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue("Пользователь уже существует"); //TODO - добавить уточнение почта или телефон
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Email не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
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
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(
                    "Пользователь уже верифицирован"
                );
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Код верификации не найден");
            }
            if (error.response.status === 403) {
                return thunkAPI.rejectWithValue("Код верификации устарел");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await instance.post("/auth/logout");
        return {};
    } catch (error: any) {
        if (!!checkErrorsBase(error.response.status)) {
            return thunkAPI.rejectWithValue(
                checkErrorsBase(error.response.status)
            );
        }
        return thunkAPI.rejectWithValue(error.message);
    }
});
