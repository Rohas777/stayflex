import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ConvenienceState } from "./types";
import { fetchConveniences } from "./actions";

const initialState: ConvenienceState = {
    conveniences: [],
    status: Status.LOADING,
    error: null,
};

export const convenienceSlice = createSlice({
    name: "convenience",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchConveniences.fulfilled, (state, action) => {
            state.conveniences = action.payload.convenience;
        });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
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
