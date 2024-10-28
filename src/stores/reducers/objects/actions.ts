import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import axios, { AxiosError } from "axios";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchObjects = createAsyncThunk(
    "object/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/object/all");
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Объекты не найдены");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const createObject = createAsyncThunk(
    "/object/create",
    async (objectData: FormData, thunkAPI) => {
        try {
            const response = await instance.post(`/object/create`, objectData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue(
                    "Регион для привязки не найден" //TODO -
                );
            }

            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const updateObject = createAsyncThunk(
    "/object/update",
    async (objectData: FormData, thunkAPI) => {
        try {
            const response = await instance.put(`/object/update`, objectData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue(
                    "Регион для привязки не найден" //TODO
                );
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const updateObiectIsActive = createAsyncThunk(
    "/object/activate",
    async (data: { id: number }, thunkAPI) => {
        try {
            const response = await instance.put(`/object/activate`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Объект не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Объект не может быть деактивирован, так как к нему привязаны активные брони"
                );
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteObject = createAsyncThunk<string, number>(
    "object/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(`/object/delete/${id}`);
            return response.data.id;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Объект не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Объект не может быть удален, так как к нему привязаны активные брони"
                );
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchObjectById = createAsyncThunk(
    "object/fetch",
    async (id: number, thunkAPI) => {
        try {
            const response = await instance.get(`/object/id/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Объект не найден");
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const fetchObjectsByUser = createAsyncThunk(
    "object/fetchByUser",
    async (id: number, thunkAPI) => {
        try {
            const response = await instance.get(`/admin/object/userid/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Объекты не найдены"); //TODO -
            }
            if (!!checkErrorsBase(error.response.status)) {
                return thunkAPI.rejectWithValue(
                    checkErrorsBase(error.response.status)
                );
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
