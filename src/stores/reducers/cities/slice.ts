import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { CityState } from "./types";
import { fetchCities } from "./actions";

const initialState: CityState = {
    cities: [],
    status: Status.LOADING,
    error: null,
};

export const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchCities.fulfilled, (state, action) => {
            state.cities = action.payload.cities;
        });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.cities = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.cities = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default citySlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
