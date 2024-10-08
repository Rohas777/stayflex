import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { RegionState } from "./types";
import { fetchRegions } from "./actions";

const initialState: RegionState = {
    regions: [],
    status: Status.LOADING,
    error: null,
};

export const regionSlice = createSlice({
    name: "region",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchRegions.fulfilled, (state, action) => {
            state.regions = action.payload.regions;
        });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.regions = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.regions = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default regionSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
