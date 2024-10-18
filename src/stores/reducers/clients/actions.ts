import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ClientCreateType } from "./types";

export const fetchClients = createAsyncThunk(
    "client/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/client/all");
        return response.data;
    }
);

export const fetchClientByPhone = createAsyncThunk(
    "client/fetchByPhone",
    async (phone: string) => {
        try {
            const response = await instance.get(`/client/phone/${phone}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
);

export const createClient = createAsyncThunk(
    "/client/create",
    async (clientData: ClientCreateType) => {
        const response = await instance.post(`/client/create`, clientData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);
