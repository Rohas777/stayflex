import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { TariffCreateType, TariffUpdateType } from "./types";

export const fetchTariffs = createAsyncThunk(
    "tariff/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/tariff/all");
        return response.data;
    }
);
export const fetchTariffById = createAsyncThunk(
    "tariff/fetch",
    async (id: number) => {
        const response = await instance.get(`/tariff/id/${id}`);
        return response.data;
    }
);

export const createTariff = createAsyncThunk(
    "/tariff/create",
    async (tariffData: TariffCreateType) => {
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
    }
);

export const updateTariff = createAsyncThunk(
    "/tariff/update",
    async (tariffData: TariffUpdateType) => {
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
    }
);
