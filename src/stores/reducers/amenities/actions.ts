import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { AmenityCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchAmenities = createAsyncThunk(
    "amenity/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/convenience/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Удобства не найдены");
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
export const createAmenity = createAsyncThunk(
    "amenity/create",
    async (amenityData: AmenityCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/convenience/create`,
                amenityData,
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

export const deleteAmenity = createAsyncThunk<string, string>(
    "amenity/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(
                `/admin/convenience/delete/${id}`
            );
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Удобство не найдено");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Удобство не может быть удалено, так как к нему уже привязаны объекты"
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
