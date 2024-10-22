import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/vars";
import { ReservationCreateType, ReservationUpdateType } from "./types";

export const fetchReservations = createAsyncThunk(
    "reservation/fetchAll",
    async (_, thunkAPI) => {
        const response = await instance.get("/reservation/all");
        return response.data;
    }
);
export const fetchReservationById = createAsyncThunk(
    "reservation/fetch",
    async (id: number) => {
        const response = await instance.get(`/reservation/id/${id}`);
        return response.data;
    }
);
export const fetchReservationsByClient = createAsyncThunk(
    "reservation/fetchByClient",
    async (client_id: number) => {
        const response = await instance.get(
            `/reservation/clientid/${client_id}`
        );
        return response.data;
    }
);
export const fetchReservationsByObject = createAsyncThunk(
    "reservation/fetchByObject",
    async (object_id: number) => {
        const response = await instance.get(
            `/reservation/objectid/${object_id}`
        );
        return response.data;
    }
);

export const createReservation = createAsyncThunk(
    "/reservation/create",
    async (reservationData: ReservationCreateType) => {
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
    }
);

export const updateReservationStatus = createAsyncThunk(
    "/reservation/updateStatus",
    async (reservationData: { id: number; status: string }) => {
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
    }
);

export const updateReservation = createAsyncThunk(
    "/reservation/update",
    async (reservationData: ReservationUpdateType) => {
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
    }
);
export const deleteReservation = createAsyncThunk<string, string>(
    "reservation/delete",
    async (id) => {
        const response = await instance.delete(`/reservation/delete/${id}`);
        return response.data.id;
    }
);
