import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { TariffCreateType } from "./types";

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
        const response = await instance.post(`/tariff/create`, tariffData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);

// export const deleteUser = createAsyncThunk<string, string>(
//     "/user/deleteUser",
//     async (id) => {
//         const response = await instance.delete(`/user/delete/${id}`);
//         return response.data.id;
//     }
// );
