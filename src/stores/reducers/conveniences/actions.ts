import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";

export const fetchConveniences = createAsyncThunk(
    "convenience/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/convenience/all");
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
