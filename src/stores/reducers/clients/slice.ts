import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ClientState } from "./types";
import {
    createClient,
    fetchClientByID,
    fetchClientByPhone,
    fetchClients,
} from "./actions";
import { error } from "console";

const initialState: ClientState = {
    clients: [],
    clientByPhone: null,
    clientOne: null,
    statusOne: Status.IDLE,
    status: Status.LOADING,
    statusByPhone: Status.LOADING,
    error: null,
    errorByPhone: null,
    isCreated: false,
    createdClient: null,
    isFound: null,
};

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        resetClientByPhone: (state) => {
            state.clientByPhone = null;
            state.statusByPhone = Status.LOADING;
            state.errorByPhone = null;
            state.isFound = null;
        },
        resetIsCreated: (state) => {
            state.isCreated = false;
            state.createdClient = null;
        },
        resetStatus: (state) => {
            state.status = Status.LOADING;
            state.error = null;
        },
        resetStatusOne: (state) => {
            state.statusOne = Status.LOADING;
            state.error = null;
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
                state.statusByPhone = Status.SUCCESS;
                if (action.payload.status === 404) {
                    state.clientByPhone = null;
                    state.isFound = false;
                    return;
                }
                state.clientByPhone = action.payload;
                state.isFound = true;
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
                    state.error = action.payload;
                }
            );
        builder
            .addCase(fetchClientByID.fulfilled, (state, action) => {
                state.statusOne = Status.SUCCESS;
                state.clientOne = action.payload;
            })
            .addCase(fetchClientByID.pending, (state, action) => {
                state.clientOne = null;
                state.statusOne = Status.LOADING;
            })
            .addCase(
                fetchClientByID.rejected,
                (state, action: PayloadAction<any>) => {
                    state.clientOne = null;
                    state.statusOne = Status.ERROR;
                    state.error = action.payload;
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
