import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { MailState } from "./types";
import { fetchMails, sendMail, updateMail } from "./actions";

const initialState: MailState = {
    mails: [],
    status: Status.IDLE,
    statusActions: Status.IDLE,
    error: null,
    isSended: false,
    isUpdated: false,
};

export const mailSlice = createSlice({
    name: "mail",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
        resetStatusActions: (state) => {
            state.statusActions = Status.IDLE;
            state.error = null;
        },
        resetIsUpdated: (state) => {
            state.isUpdated = false;
        },
        resetIsSended: (state) => {
            state.isSended = false;
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
        builder
            .addCase(updateMail.fulfilled, (state) => {
                state.statusActions = Status.SUCCESS;
                state.error = null;
                state.isUpdated = true;
            })
            .addCase(updateMail.pending, (state) => {
                state.statusActions = Status.LOADING;
                state.error = null;
                state.isUpdated = false;
            })
            .addCase(
                updateMail.rejected,
                (state, action: PayloadAction<any>) => {
                    state.statusActions = Status.ERROR;
                    state.error = action.payload;
                    state.isUpdated = false;
                }
            );
        builder
            .addCase(sendMail.fulfilled, (state) => {
                state.statusActions = Status.SUCCESS;
                state.error = null;
                state.isSended = true;
            })
            .addCase(sendMail.pending, (state) => {
                state.statusActions = Status.LOADING;
                state.error = null;
                state.isSended = false;
            })
            .addCase(sendMail.rejected, (state, action: PayloadAction<any>) => {
                state.statusActions = Status.ERROR;
                state.error = action.payload;
                state.isSended = false;
            });
    },
});

export default mailSlice.reducer;
