import { IUser } from "@/stores/models/IUser";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { UserCreateType } from "./types";

export const fetchUsers = createAsyncThunk(
    "user/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/user/all");
        return response.data;
    }
);
export const createUser = createAsyncThunk(
    "/user/create",
    async (data: UserCreateType) => {
        const response = await instance.post(`/user/create`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
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

export const updateUserIsActive = createAsyncThunk(
    "/user/activate",
    async (data: { id: number }) => {
        const response = await instance.put(`/user/activate`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
);
export const fetchUserById = createAsyncThunk(
    "user/fetch",
    async (id: number) => {
        const response = await instance.get(`/user/id/?id=${id}`);
        return response.data;
    }
);
