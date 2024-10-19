import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { AmenityState } from "./types";
import { createAmenity, deleteAmenity, fetchAmenities } from "./actions";

const initialState: AmenityState = {
    amenities: [],
    status: Status.LOADING,
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
    },
    extraReducers(builder) {
        builder.addCase(fetchAmenities.fulfilled, (state, action) => {
            state.amenities = action.payload.convenience;
        });
        builder
            .addCase(createAmenity.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(deleteAmenity.fulfilled, (state) => {
                state.isDeleted = true;
            });
        builder
            .addMatcher(isPending, (state) => {
                state.amenities = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.amenities = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default amenitySlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
