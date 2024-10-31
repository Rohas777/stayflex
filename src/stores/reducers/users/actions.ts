import { IUser } from "@/stores/models/IUser";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { UserCreateType, UserTariffUpdateType, UserUpdateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchUsers = createAsyncThunk(
    "user/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/admin/user/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователи не найдены");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const createUser = createAsyncThunk(
    "/user/create",
    async (data: UserCreateType, thunkAPI) => {
        try {
            const response = await instance.post(`/admin/user/create`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue("Пользователь уже существует");
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Email не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const deleteUser = createAsyncThunk<string, string>(
    "/user/deleteUser",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(`/admin/user/delete/${id}`);
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Пользователь не может быть удален"
                );
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const updateUserIsActive = createAsyncThunk(
    "/user/activate",
    async (data: { id: number }, thunkAPI) => {
        try {
            const response = await instance.put(`/admin/user/activate`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const fetchUserById = createAsyncThunk(
    "user/fetch",
    async (id: number, thunkAPI) => {
        try {
            const response = await instance.get(`/admin/user/id/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const updateUserAdmin = createAsyncThunk(
    "/user/update",
    async (userData: UserUpdateType, thunkAPI) => {
        try {
            const response = await instance.put(
                `/admin/user/update`,
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден"); //TODO - или email
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const updateUserTariff = createAsyncThunk(
    "/user/updateTariff",
    async (tariffData: UserTariffUpdateType, thunkAPI) => {
        try {
            const response = await instance.put(
                `/admin/user/tariff/activate`,
                tariffData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Пользователь не найден"); //TODO - или тариф
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const fetchAuthorizedUser = createAsyncThunk(
    "user/profile",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/user/profile");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
