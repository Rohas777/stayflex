import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ObjectState } from "./types";
import {
    createObject,
    deleteObject,
    fetchObjectById,
    fetchObjects,
    fetchObjectsByUser,
    updateObiectIsActive,
} from "./actions";

const initialState: ObjectState = {
    objects: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
    objectOne: null,
    statusOne: Status.LOADING,
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
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetIsActiveStatusUpdated: (state) => {
            state.isActiveStatusUpdated = false;
        },
        resetObjectOne: (state) => {
            state.objectOne = null;
            state.statusOne = Status.LOADING;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchObjects.fulfilled, (state, action) => {
                state.objects = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchObjects.pending, (state) => {
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
            )
            .addCase(fetchObjectsByUser.fulfilled, (state, action) => {
                state.objects = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchObjectsByUser.pending, (state) => {
                state.objects = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchObjectsByUser.rejected,
                (state, action: PayloadAction<any>) => {
                    state.objects = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(fetchObjectById.fulfilled, (state, action) => {
                state.objectOne = action.payload;
                state.statusOne = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchObjectById.pending, (state) => {
                state.objectOne = null;
                state.statusOne = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchObjectById.rejected,
                (state, action: PayloadAction<any>) => {
                    state.objectOne = null;
                    state.error = action.payload;
                    state.statusOne = Status.ERROR;
                }
            );

        builder
            .addCase(updateObiectIsActive.fulfilled, (state) => {
                state.isActiveStatusUpdated = true;
            })
            .addCase(deleteObject.fulfilled, (state) => {
                state.isDeleted = true;
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
