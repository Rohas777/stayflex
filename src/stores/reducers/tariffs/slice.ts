import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { TariffState } from "./types";
import { fetchTariffById, fetchTariffs } from "./actions";

const initialState: TariffState = {
    tariffs: [],
    tariffById: null,
    status: Status.LOADING,
    error: null,
};

export const tariffSlice = createSlice({
    name: "tariff",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchTariffs.fulfilled, (state, action) => {
            state.tariffs = action.payload;
        });
        builder.addCase(fetchTariffById.fulfilled, (state, action) => {
            state.tariffById = action.payload;
        });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.tariffs = [];
                state.tariffById = null;
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.tariffs = [];
                state.tariffById = null;
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default tariffSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
