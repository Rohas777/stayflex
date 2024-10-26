import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { AmenityCreateType } from "./types";

export const fetchAmenities = createAsyncThunk(
    "amenity/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/convenience/all");
        return response.data;
    }
);
export const createAmenity = createAsyncThunk(
    "amenity/create",
    async (amenityData: AmenityCreateType) => {
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
    }
);

export const deleteAmenity = createAsyncThunk<string, string>(
    "amenity/delete",
    async (id) => {
        const response = await instance.delete(
            `/admin/convenience/delete/${id}`
        );
        return response.data.id;
    }
);
