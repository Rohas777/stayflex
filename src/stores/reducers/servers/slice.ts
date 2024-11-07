import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ServerState } from "./types";
import {
    createServer,
    deleteServer,
    fetchServers,
    serverSetDefault,
    updateServer,
} from "./actions";

const initialState: ServerState = {
    servers: [],
    status: Status.IDLE,
    statusAction: Status.IDLE,
    error: null,
    isCreated: false,
    isSetDefault: false,
    isDeleted: false,
    isUpdated: false,
};

export const serverSlice = createSlice({
    name: "server",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetIsUpdated: (state) => {
            state.isUpdated = false;
        },
        resetIsSetDefault: (state) => {
            state.isSetDefault = false;
        },
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.statusAction = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchServers.fulfilled, (state, action) => {
                state.servers = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchServers.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchServers.rejected,
                (state, action: PayloadAction<any>) => {
                    state.servers = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createServer.fulfilled, (state, action) => {
                state.statusAction = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createServer.pending, (state) => {
                state.statusAction = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createServer.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.statusAction = Status.ERROR;
                    state.isCreated = false;
                }
            );
        builder
            .addCase(serverSetDefault.fulfilled, (state, action) => {
                state.statusAction = Status.SUCCESS;
                state.error = null;
                state.isSetDefault = true;
            })
            .addCase(serverSetDefault.pending, (state) => {
                state.statusAction = Status.LOADING;
                state.error = null;
                state.isSetDefault = false;
            })
            .addCase(
                serverSetDefault.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.statusAction = Status.ERROR;
                    state.isSetDefault = false;
                }
            );
        builder
            .addCase(updateServer.fulfilled, (state, action) => {
                state.statusAction = Status.SUCCESS;
                state.error = null;
                state.isUpdated = true;
            })
            .addCase(updateServer.pending, (state) => {
                state.statusAction = Status.LOADING;
                state.error = null;
                state.isUpdated = false;
            })
            .addCase(
                updateServer.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.statusAction = Status.ERROR;
                    state.isUpdated = false;
                }
            );
        builder
            .addCase(deleteServer.fulfilled, (state, action) => {
                state.statusAction = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteServer.pending, (state) => {
                state.statusAction = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteServer.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.statusAction = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default serverSlice.reducer;
