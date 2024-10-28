import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { RegionState } from "./types";
import { createRegion, deleteRegion, fetchRegions } from "./actions";

const initialState: RegionState = {
    regions: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const regionSlice = createSlice({
    name: "region",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetStatus: (state) => {
            state.status = Status.LOADING;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchRegions.fulfilled, (state, action) => {
                state.regions = action.payload.regions;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchRegions.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchRegions.rejected,
                (state, action: PayloadAction<any>) => {
                    state.regions = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createRegion.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createRegion.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createRegion.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isCreated = false;
                }
            );
        builder
            .addCase(deleteRegion.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteRegion.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteRegion.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default regionSlice.reducer;
