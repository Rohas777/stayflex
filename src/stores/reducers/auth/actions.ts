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
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
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

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
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
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 403) {
                return thunkAPI.rejectWithValue("Код авторизации устарел");
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Код авторизации не найден");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
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
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue("Пользователь уже существует"); //TODO - добавить уточнение почта или телефон
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Email не найден");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
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
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
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

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await instance.post("/auth/logout");
        return {};
    } catch (error: any) {
        if (!!checkErrorsBase(error)) {
            return thunkAPI.rejectWithValue(checkErrorsBase(error));
        }
        if (error.code === "ERR_NETWORK") {
            return thunkAPI.rejectWithValue("Ошибка сети");
        }
        if (!!checkErrorsBase(error)) {
            return thunkAPI.rejectWithValue(checkErrorsBase(error));
        }
        return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
    }
});
