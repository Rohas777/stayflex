import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { AuthState } from "./types";
import { activate, auth, logout, signIn, signUp } from "./actions";

const initialState: AuthState = {
    user: null,
    authTempUser: null,
    status: Status.IDLE,
    signInStatus: Status.IDLE,
    signUpStatus: Status.IDLE,
    logoutStatus: Status.IDLE,
    codeStatus: Status.IDLE,
    error: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(signUp.fulfilled, (state, action) => {
                state.authTempUser = action.payload;
                state.status = Status.SUCCESS;
                state.signUpStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(signUp.pending, (state) => {
                state.authTempUser = null;
                state.status = Status.LOADING;
                state.signUpStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
                state.authTempUser = null;
                state.error = action.payload;
                state.signUpStatus = Status.ERROR;
                state.status = Status.ERROR;
            });
        builder
            .addCase(activate.fulfilled, (state, action) => {
                state.authTempUser = action.payload;
                state.status = Status.SUCCESS;
                state.codeStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(activate.pending, (state) => {
                state.status = Status.LOADING;
                state.codeStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(activate.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.codeStatus = Status.ERROR;
                state.status = Status.ERROR;
            });
        builder
            .addCase(signIn.fulfilled, (state, action) => {
                state.authTempUser = action.payload;
                state.status = Status.SUCCESS;
                state.signInStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(signIn.pending, (state) => {
                state.authTempUser = null;
                state.status = Status.LOADING;
                state.signInStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
                state.authTempUser = null;
                state.error = action.payload;
                state.signInStatus = Status.ERROR;
                state.status = Status.ERROR;
            });
        builder
            .addCase(auth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = Status.SUCCESS;
                state.codeStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(auth.pending, (state) => {
                state.status = Status.LOADING;
                state.codeStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(auth.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.codeStatus = Status.ERROR;
                state.status = Status.ERROR;
            });
        builder
            .addCase(logout.fulfilled, (state, action) => {
                state.logoutStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(logout.pending, (state) => {
                state.logoutStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.logoutStatus = Status.ERROR;
            });
    },
});

export default authSlice.reducer;
