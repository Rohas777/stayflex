import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { PropertyTypeCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchPropertyTypes = createAsyncThunk(
    "propertyType/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/property-type/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Типы недвижимости не найдены");
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
export const createPropertyType = createAsyncThunk(
    "/propertyType/create",
    async (params: PropertyTypeCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/property-type/create`,
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
export const deletePropertyType = createAsyncThunk<string, string>(
    "/propertyType/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(
                `/admin/property-type/delete/${id}`
            );
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Тип недвижимости не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Тип недвижимости не может быть удален, так как к нему уже привязаны объекты"
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
