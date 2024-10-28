import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { RegionCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchRegions = createAsyncThunk(
    "region/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/region/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Регионы не найдены");
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

export const createRegion = createAsyncThunk(
    "/region/create",
    async (params: RegionCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/region/create`,
                params,
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
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteRegion = createAsyncThunk<string, string>(
    "/region/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(
                `/admin/region/delete/${id}`
            );
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Регион не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Регион не может быть удален, так как к нему уже привязаны города"
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
