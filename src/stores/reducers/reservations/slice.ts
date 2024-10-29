import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ReservationState } from "./types";
import {
    createReservation,
    fetchReservationsByClient,
    fetchReservationById,
    fetchReservations,
    updateReservation,
    updateReservationStatus,
    fetchReservationsByObject,
    deleteReservation,
} from "./actions";

const initialState: ReservationState = {
    reservations: [],
    reservationOne: null,
    statusAll: Status.IDLE,
    statusOne: Status.IDLE,
    error: null,
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
};

export const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsUpdated: (state) => {
            state.isUpdated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetReservationOne: (state) => {
            state.reservationOne = null;
            state.statusOne = Status.IDLE;
        },
        resetStatus: (state) => {
            state.statusAll = Status.IDLE;
            state.error = null;
        },
        resetStatusOne: (state) => {
            state.statusOne = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.reservations = action.payload;
                state.error = null;
            })
            .addCase(fetchReservations.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
                state.error = null;
            })
            .addCase(
                fetchReservations.rejected,
                (state, action: PayloadAction<any>) => {
                    state.statusAll = Status.ERROR;
                    state.reservations = [];
                    state.error = action.payload;
                }
            );

        builder
            .addCase(fetchReservationsByClient.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.reservations = action.payload;
                state.error = null;
            })
            .addCase(fetchReservationsByClient.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
                state.error = null;
            })
            .addCase(
                fetchReservationsByClient.rejected,
                (state, action: PayloadAction<any>) => {
                    state.statusAll = Status.ERROR;
                    state.reservations = [];
                    state.error = action.payload;
                }
            );
        builder
            .addCase(fetchReservationsByObject.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.reservations = action.payload;
                state.error = null;
            })
            .addCase(fetchReservationsByObject.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
                state.error = null;
            })
            .addCase(
                fetchReservationsByObject.rejected,
                (state, action: PayloadAction<any>) => {
                    state.statusAll = Status.ERROR;
                    state.reservations = [];
                    state.error = action.payload;
                }
            );
        builder
            .addCase(fetchReservationById.fulfilled, (state, action) => {
                state.statusOne = Status.SUCCESS;
                state.reservationOne = action.payload;
                state.error = null;
            })
            .addCase(fetchReservationById.pending, (state) => {
                state.statusOne = Status.LOADING;
                state.reservationOne = null;
                state.error = null;
            })
            .addCase(
                fetchReservationById.rejected,
                (state, action: PayloadAction<any>) => {
                    state.reservationOne = null;
                    state.statusOne = Status.ERROR;
                    state.error = action.payload;
                }
            );
        builder
            .addCase(createReservation.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createReservation.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.isCreated = false;
                state.error = null;
            })
            .addCase(
                createReservation.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isCreated = false;
                    state.statusAll = Status.ERROR;
                    state.error = action.payload;
                }
            );
        builder
            .addCase(updateReservation.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isUpdated = true;
            })
            .addCase(updateReservation.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.isUpdated = false;
                state.error = null;
            })
            .addCase(
                updateReservation.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isUpdated = false;
                    state.statusAll = Status.ERROR;
                    state.error = action.payload;
                }
            );
        builder
            .addCase(updateReservationStatus.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isUpdated = true;
            })
            .addCase(updateReservationStatus.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.isUpdated = false;
                state.error = null;
            })
            .addCase(
                updateReservationStatus.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isUpdated = false;
                    state.statusAll = Status.ERROR;
                    state.error = action.payload;
                }
            );
        builder
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteReservation.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.isDeleted = false;
                state.error = null;
            })
            .addCase(
                deleteReservation.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isDeleted = false;
                    state.statusAll = Status.ERROR;
                    state.error = action.payload;
                }
            );
    },
});

export default reservationSlice.reducer;
