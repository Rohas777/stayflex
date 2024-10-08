import { IUser } from "@/stores/models/IUser";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";

export const fetchUsers = createAsyncThunk(
    "user/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/user/all");
        return response.data;
    }
);

export const deleteUser = createAsyncThunk<string, string>(
    "/user/deleteUser",
    async (id) => {
        const response = await instance.delete(`/user/delete/${id}`);
        return response.data.id;
    }
);
