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
    statusAll: Status.LOADING,
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
            state.statusAll = Status.LOADING;
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
            })
            .addCase(fetchReservations.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
            })
            .addCase(fetchReservations.rejected, (state) => {
                state.statusAll = Status.ERROR;
                state.reservations = [];
            });

        builder
            .addCase(fetchReservationsByClient.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.reservations = action.payload;
            })
            .addCase(fetchReservationsByClient.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
            })
            .addCase(fetchReservationsByClient.rejected, (state) => {
                state.statusAll = Status.ERROR;
                state.reservations = [];
            });
        builder
            .addCase(fetchReservationsByObject.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.reservations = action.payload;
            })
            .addCase(fetchReservationsByObject.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.reservations = [];
            })
            .addCase(fetchReservationsByObject.rejected, (state) => {
                state.statusAll = Status.ERROR;
                state.reservations = [];
            });
        builder
            .addCase(fetchReservationById.fulfilled, (state, action) => {
                state.statusOne = Status.SUCCESS;
                state.reservationOne = action.payload;
            })
            .addCase(fetchReservationById.pending, (state) => {
                state.statusOne = Status.LOADING;
                state.reservationOne = null;
            })
            .addCase(fetchReservationById.rejected, (state) => {
                state.reservationOne = null;
                state.statusOne = Status.ERROR;
            });
        builder
            .addCase(createReservation.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(updateReservation.fulfilled, (state) => {
                state.isUpdated = true;
            })
            .addCase(updateReservationStatus.fulfilled, (state) => {
                state.isUpdated = true;
            })
            .addCase(deleteReservation.fulfilled, (state) => {
                state.isDeleted = true;
            });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.error = action.payload;
            });
    },
});

export default reservationSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
