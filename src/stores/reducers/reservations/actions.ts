import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ReservationCreateType, ReservationUpdateType } from "./types";
import { checkErrorsBase } from "@/utils/customUtils";

export const fetchReservations = createAsyncThunk(
    "reservation/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await instance.get("/reservation/all");
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Брони не найдены");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const fetchReservationById = createAsyncThunk(
    "reservation/fetch",
    async (id: number, thunkAPI) => {
        try {
            const response = await instance.get(`/reservation/id/${id}`);
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Бронь не найдена");
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const fetchReservationsByClient = createAsyncThunk(
    "reservation/fetchByClient",
    async (client_id: number, thunkAPI) => {
        try {
            const response = await instance.get(
                `/reservation/clientid/${client_id}`
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Брони или клиент не найдены"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const fetchReservationsByObject = createAsyncThunk(
    "reservation/fetchByObject",
    async (object_id: number, thunkAPI) => {
        try {
            const response = await instance.get(
                `/reservation/objectid/${object_id}`
            );
            return response.data;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Брони или объект не найдены"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const createReservation = createAsyncThunk(
    "/reservation/create",
    async (reservationData: ReservationCreateType, thunkAPI) => {
        try {
            const response = await instance.post(
                `/reservation/create`,
                reservationData,
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
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Бронь не создана"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const updateReservationStatus = createAsyncThunk(
    "/reservation/updateStatus",
    async (reservationData: { id: number; status: string }, thunkAPI) => {
        try {
            const response = await instance.put(
                `/reservation/status`,
                reservationData,
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
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Бронь не найдена"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);

export const updateReservation = createAsyncThunk(
    "/reservation/update",
    async (reservationData: ReservationUpdateType, thunkAPI) => {
        try {
            const response = await instance.put(
                `/reservation/update`,
                reservationData,
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
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Бронь не найдена"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
export const deleteReservation = createAsyncThunk<string, string>(
    "reservation/delete",
    async (id, thunkAPI) => {
        try {
            const response = await instance.delete(`/reservation/delete/${id}`);
            return response.data.id;
        } catch (error: any) {
            if (!!checkErrorsBase(error)) {
                return thunkAPI.rejectWithValue(checkErrorsBase(error));
            }
            if (error.response.status === 404) {
                return thunkAPI.rejectWithValue("Бронь не найдена"); //TODO -
            }

            return thunkAPI.rejectWithValue("Внутренняя ошибка сервера");
        }
    }
);
