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
        const response = await axios.post(
            `https://8831-88-135-114-202.ngrok-free.app/convenience/create`,
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

// export const deleteUser = createAsyncThunk<string, string>(
//     "/user/deleteUser",
//     async (id) => {
//         const response = await instance.delete(`/user/delete/${id}`);
//         return response.data.id;
//     }
// );
