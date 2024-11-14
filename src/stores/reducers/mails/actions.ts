import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { checkErrorsBase } from "@/utils/customUtils";
import { SendMail, UpdateMail } from "./types";

export const fetchMails = createAsyncThunk(
    "mail/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/admin/email/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Шаблоны почты не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const updateMail = createAsyncThunk(
    "mail/update",
    async (mailData: UpdateMail, thunkAPI) => {
        try {
            const response = await instance.put(
                "/admin/email/" + mailData.slug,
                mailData
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Шаблон почты не найден");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const sendMail = createAsyncThunk(
    "mail/send",
    async (mailData: SendMail, thunkAPI) => {
        try {
            const response = await instance.post("/admin/email/send", mailData);
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
