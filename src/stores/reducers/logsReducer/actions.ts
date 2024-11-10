import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchLogs = createAsyncThunk(
    "log/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/admin/log/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Логи не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
