import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ClientCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchClients = createAsyncThunk(
    "client/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/client/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Клиенты не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const fetchClientByPhone = createAsyncThunk(
    "client/fetchByPhone",
    async (phone: string, thunkAPI) => {
        try {
            const response = await instance.get(`/client/phone/${phone}`);
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return { type: "fulfill", status: error.response.status };
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const createClient = createAsyncThunk(
    "/client/create",
    async (clientData: ClientCreateType, thunkAPI) => {
        try {
            const response = await instance.post(`/client/create`, clientData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Email не найден");
            }
            if (error.response.status === 406) {
                return thunkAPI.rejectWithValue("Email уже существует");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
