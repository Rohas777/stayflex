import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { PropertyTypeCreateType } from "./types";

export const fetchPropertyTypes = createAsyncThunk(
    "propertyType/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/property-type/all");
        return response.data;
    }
);
export const createPropertyType = createAsyncThunk(
    "/propertyType/create",
    async (params: PropertyTypeCreateType) => {
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
    }
);
export const deletePropertyType = createAsyncThunk<string, string>(
    "/propertyType/delete",
    async (id) => {
        const response = await instance.delete(
            `/admin/property-type/delete/${id}`
        );
        return response.data.id;
    }
);
