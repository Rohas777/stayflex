import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ClientState } from "./types";
import { createClient, fetchClientByPhone, fetchClients } from "./actions";

const initialState: ClientState = {
    clients: [],
    clientByPhone: null,
    status: Status.LOADING,
    statusByPhone: Status.LOADING,
    error: null,
    errorByPhone: null,
    isCreated: false,
    createdClient: null,
};

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        resetClientByPhone: (state) => {
            state.clientByPhone = null;
            state.statusByPhone = Status.LOADING;
            state.errorByPhone = null;
        },
        resetIsCreated: (state) => {
            state.isCreated = false;
            state.createdClient = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchClients.pending, (state, action) => {
                state.clients = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchClients.rejected,
                (state, action: PayloadAction<any>) => {
                    state.clients = [];
                    state.status = Status.ERROR;
                    state.error = action.payload;
                }
            );
        builder
            .addCase(fetchClientByPhone.fulfilled, (state, action) => {
                state.clientByPhone = action.payload;
                state.statusByPhone = Status.SUCCESS;
            })
            .addCase(fetchClientByPhone.pending, (state, action) => {
                state.clientByPhone = null;
                state.statusByPhone = Status.LOADING;
            })
            .addCase(
                fetchClientByPhone.rejected,
                (state, action: PayloadAction<any>) => {
                    state.clientByPhone = null;
                    state.statusByPhone = Status.ERROR;
                    state.errorByPhone = action.payload;
                }
            );

        builder
            .addCase(createClient.fulfilled, (state, action) => {
                state.isCreated = true;
                state.createdClient = action.payload;
            })
            .addCase(createClient.pending, (state) => {
                state.isCreated = false;
                state.createdClient = null;
            })
            .addCase(createClient.rejected, (state) => {
                state.isCreated = false;
                state.createdClient = null;
            });
    },
});

export default clientSlice.reducer;
