import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { CityCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchCities = createAsyncThunk(
    "city/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/city/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Города не найдены");
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
export const createCity = createAsyncThunk(
    "/city/create",
    async (params: CityCreateType, thunkAPI) => {
        try {
            const response = await instance.post(`/admin/city/create`, params, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue(
                    "Регион для привязки не найден"
                );
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
export const deleteCity = createAsyncThunk<string, string>(
    "/city/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(`/admin/city/delete/${id}`);
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Город не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Город не может быть удален, так как к нему уже привязаны объекты"
                );
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
