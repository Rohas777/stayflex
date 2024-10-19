import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import axios from "axios";
import { ConvenienceCreateType } from "./types";

export const fetchConveniences = createAsyncThunk(
    "convenience/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/convenience/all");
        return response.data;
    }
);
export const createConvenience = createAsyncThunk(
    "/convenience/create",
    async (convenienceData: ConvenienceCreateType) => {
        const response = await instance.post(
            `/convenience/create`,
            {
                convenience_name: convenienceData.convenience_name,
                file: convenienceData.file,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    }
);

export const deleteConvenience = createAsyncThunk<string, string>(
    "/convenience/delete",
    async (id) => {
        const response = await instance.delete(`/convenience/delete?id=${id}`);
        return response.data.id;
    }
);
