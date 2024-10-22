import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ObjectCreateBodyType } from "./types";
import axios from "axios";

export const fetchObjects = createAsyncThunk(
    "object/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/object/all");
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
);
export const createObject = createAsyncThunk(
    "/object/create",
    async (objectData: FormData) => {
        try {
            const response = await instance.post(`/object/create`, objectData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            return error;
        }
    }
);
export const updateObiectIsActive = createAsyncThunk(
    "/object/activate",
    async (data: { id: number }) => {
        const response = await instance.put(`/object/activate`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);

export const deleteObject = createAsyncThunk<string, number>(
    "object/delete",
    async (id) => {
        const response = await instance.delete(`/object/delete?id=${id}`);
        return response.data.id;
    }
);

export const fetchObjectById = createAsyncThunk(
    "object/fetch",
    async (id: number) => {
        const response = await instance.get(`/object/id/${id}`);
        return response.data;
    }
);
