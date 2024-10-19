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
    status: Status.LOADING,
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
    },
    extraReducers(builder) {
        builder.addCase(fetchPropertyTypes.fulfilled, (state, action) => {
            state.propertyTypes = action.payload.apartments;
        });

        builder
            .addCase(createPropertyType.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(deletePropertyType.fulfilled, (state) => {
                state.isDeleted = true;
            });
        builder
            .addMatcher(isPending, (state) => {
                state.propertyTypes = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.propertyTypes = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default propertyTypeSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
