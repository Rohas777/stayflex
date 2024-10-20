import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ObjectState } from "./types";
import { createObject, fetchObjects, updateObiectIsActive } from "./actions";

const initialState: ObjectState = {
    objects: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isUpdated: false,
    isActiveStatusUpdated: false,
};

export const objectSlice = createSlice({
    name: "object",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsUpdated: (state) => {
            state.isUpdated = false;
        },
        resetIsActiveStatusUpdated: (state) => {
            state.isActiveStatusUpdated = false;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchObjects.fulfilled, (state, action) => {
                state.objects = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchObjects.pending, (state, action) => {
                state.objects = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchObjects.rejected,
                (state, action: PayloadAction<any>) => {
                    state.objects = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );

        builder.addCase(updateObiectIsActive.fulfilled, (state) => {
            state.isActiveStatusUpdated = true;
        });
        builder
            .addCase(createObject.fulfilled, (state) => {
                state.isCreated = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(createObject.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                createObject.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isCreated = false;
                    state.objects = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
    },
});

export default objectSlice.reducer;
