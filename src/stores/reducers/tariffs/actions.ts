import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { TariffCreateType, TariffUpdateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchTariffs = createAsyncThunk(
    "tariff/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/tariff/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Тарифы не найдены");
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
export const fetchTariffById = createAsyncThunk(
    "tariff/fetch",
    async (id: number, thunkAPI) => {
        try {
            const response = await instance.get(`/tariff/id/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Тариф не найден");
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

export const createTariff = createAsyncThunk(
    "/tariff/create",
    async (tariffData: TariffCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/tariff/create`,
                tariffData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
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

export const updateTariff = createAsyncThunk(
    "/tariff/update",
    async (tariffData: TariffUpdateType, thunkAPI) => {
        try {
            const response = await instance.put(
                `/admin/tariff/update`,
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
                return thunkAPI.rejectWithValue("Тариф не найден");
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
