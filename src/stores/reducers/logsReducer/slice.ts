import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { LogState } from "./types";
import { fetchLogs } from "./actions";

const initialState: LogState = {
    logs: [],
    status: Status.LOADING,
    error: null,
};

export const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchLogs.fulfilled, (state, action) => {
                state.logs = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchLogs.pending, (state, action) => {
                state.logs = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchLogs.rejected,
                (state, action: PayloadAction<any>) => {
                    state.logs = [];
                    state.status = Status.ERROR;
                    state.error = action.payload;
                }
            );
    },
});

export default logSlice.reducer;
