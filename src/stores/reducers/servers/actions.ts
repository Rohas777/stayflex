import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ServerCreateType, ServerUpdateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchServers = createAsyncThunk(
    "server/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/admin/server/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Сервера не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const createServer = createAsyncThunk(
    "/server/create",
    async (serverData: ServerCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/server/create`,
                serverData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const serverSetDefault = createAsyncThunk(
    "/server/set-default",
    async (id: string, thunkAPI) => {
        try {
            const response = await instance.put(
                `/admin/server/activate/?server_id=${id}`
            );
            return id;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Сервер не найден");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const updateServer = createAsyncThunk(
    "/server/update",
    async (serverData: ServerUpdateType, thunkAPI) => {
        try {
            const response = await instance.put(
                `/admin/server/update`,
                serverData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Сервер не найден");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const deleteServer = createAsyncThunk<string, string>(
    "/server/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(
                `/admin/server/delete/${id}`
            );
            return response.data.id;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Сервер не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Сервер не может быть удален, так как к нему уже привязаны элементы системы"
                );
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
