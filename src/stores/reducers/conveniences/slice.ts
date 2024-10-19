import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ConvenienceState } from "./types";
import {
    createConvenience,
    deleteConvenience,
    fetchConveniences,
} from "./actions";

const initialState: ConvenienceState = {
    conveniences: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const convenienceSlice = createSlice({
    name: "convenience",
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
        builder.addCase(fetchConveniences.fulfilled, (state, action) => {
            state.conveniences = action.payload.convenience;
        });
        builder
            .addCase(createConvenience.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(deleteConvenience.fulfilled, (state) => {
                state.isDeleted = true;
            });
        builder
            .addMatcher(isPending, (state) => {
                state.conveniences = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.conveniences = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default convenienceSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
