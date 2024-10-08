import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { PropertyTypeState } from "./types";
import { fetchPropertyTypes } from "./actions";

const initialState: PropertyTypeState = {
    propertyTypes: [],
    status: Status.LOADING,
    error: null,
};

export const propertyTypeSlice = createSlice({
    name: "propertyType",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchPropertyTypes.fulfilled, (state, action) => {
            state.propertyTypes = action.payload.apartments;
        });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.propertyTypes = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.propertyTypes = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default propertyTypeSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
