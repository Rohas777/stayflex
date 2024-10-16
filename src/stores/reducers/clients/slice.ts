import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ClientState } from "./types";
import { fetchClients } from "./actions";

const initialState: ClientState = {
    clients: [],
    status: Status.LOADING,
    error: null,
};

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchClients.fulfilled, (state, action) => {
            state.clients = action.payload;
        });
        builder
            .addMatcher(isPending, (state) => {
                state.clients = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.clients = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default clientSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
