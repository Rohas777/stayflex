import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { AmenityState } from "./types";
import { createAmenity, deleteAmenity, fetchAmenities } from "./actions";

const initialState: AmenityState = {
    amenities: [],
    status: Status.IDLE,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const amenitySlice = createSlice({
    name: "amenity",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetStatus(state) {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAmenities.fulfilled, (state, action) => {
                state.amenities = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchAmenities.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchAmenities.rejected,
                (state, action: PayloadAction<any>) => {
                    state.amenities = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createAmenity.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createAmenity.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createAmenity.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isCreated = false;
                }
            );

        builder
            .addCase(deleteAmenity.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteAmenity.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteAmenity.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default amenitySlice.reducer;
