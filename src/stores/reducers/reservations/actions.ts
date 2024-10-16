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
// export const deleteUser = createAsyncThunk<string, string>(
//     "/user/deleteUser",
//     async (id) => {
//         const response = await instance.delete(`/user/delete/${id}`);
//         return response.data.id;
//     }
// );
