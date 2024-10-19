import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { CityCreateType } from "./types";

export const fetchCities = createAsyncThunk(
    "city/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/city/all");
        return response.data;
    }
);
export const createCity = createAsyncThunk(
    "/city/create",
    async (params: CityCreateType) => {
        const response = await instance.post(`/city/create`, params, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);
export const deleteCity = createAsyncThunk<string, string>(
    "/city/delete",
    async (id) => {
        const response = await instance.delete(`/city/delete?id=${id}`);
        return response.data.id;
    }
);
