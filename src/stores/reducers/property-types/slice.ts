import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { PropertyTypeState } from "./types";
import {
    createPropertyType,
    deletePropertyType,
    fetchPropertyTypes,
} from "./actions";

const initialState: PropertyTypeState = {
    propertyTypes: [],
    status: Status.IDLE,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const propertyTypeSlice = createSlice({
    name: "propertyType",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
                state.propertyTypes = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchPropertyTypes.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchPropertyTypes.rejected,
                (state, action: PayloadAction<any>) => {
                    state.propertyTypes = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createPropertyType.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createPropertyType.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createPropertyType.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isCreated = false;
                }
            );
        builder
            .addCase(deletePropertyType.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deletePropertyType.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deletePropertyType.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default propertyTypeSlice.reducer;
