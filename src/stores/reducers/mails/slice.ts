import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { MailState } from "./types";
import { fetchMails } from "./actions";

const initialState: MailState = {
    mails: [],
    status: Status.LOADING,
    error: null,
};

export const mailSlice = createSlice({
    name: "mail",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMails.fulfilled, (state, action) => {
                state.mails = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchMails.pending, (state, action) => {
                state.mails = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchMails.rejected,
                (state, action: PayloadAction<any>) => {
                    state.mails = [];
                    state.status = Status.ERROR;
                    state.error = action.payload;
                }
            );
    },
});

export default mailSlice.reducer;
