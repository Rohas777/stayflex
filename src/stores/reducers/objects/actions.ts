import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ObjectCreateType } from "./types";

export const fetchObjects = createAsyncThunk(
    "object/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/object/all");
        return response.data;
    }
);
export const createObject = createAsyncThunk(
    "/object/create",
    async (params: ObjectCreateType) => {
        const response = await instance.post(`/object/create`, params, {
            headers: {
                "Content-Type": "application/json",
            },
        });
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
