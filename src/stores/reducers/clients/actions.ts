import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";

export const fetchClients = createAsyncThunk(
    "client/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/client/all");
        return response.data;
    }
);
