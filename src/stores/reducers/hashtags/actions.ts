import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { HashtagCreateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchHashtags = createAsyncThunk(
    "hashtag/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/hashtag/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Хэштеги не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const createHashtag = createAsyncThunk(
    "hashtag/create",
    async (hashtagData: HashtagCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/admin/hashtag/create`,
                hashtagData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const deleteHashtag = createAsyncThunk<string, string>(
    "hashtag/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(
                `/admin/hashtag/delete/${id}`
            );
            return response.data.id;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Хэштег не найден");
            }
            if (error.response.status === 409) {
                return thunkAPI.rejectWithValue(
                    "Хэштег не может быть удалён, так как к нему уже привязаны объекты"
                );
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
