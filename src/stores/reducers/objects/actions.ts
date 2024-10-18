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

// export const deleteUser = createAsyncThunk<string, string>(
//     "/user/deleteUser",
//     async (id) => {
//         const response = await instance.delete(`/user/delete/${id}`);
//         return response.data.id;
//     }
// );
