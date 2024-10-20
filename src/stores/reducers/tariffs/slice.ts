import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { TariffState } from "./types";
import {
    createTariff,
    fetchTariffById,
    fetchTariffs,
    updateTariff,
} from "./actions";

const initialState: TariffState = {
    tariffs: [],
    tariffById: null,
    statusAll: Status.LOADING,
    statusByID: Status.LOADING,
    error: null,
    isCreated: false,
};

export const tariffSlice = createSlice({
    name: "tariff",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTariffs.fulfilled, (state, action) => {
                state.statusAll = Status.SUCCESS;
                state.tariffs = action.payload;
            })
            .addCase(fetchTariffs.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.tariffs = [];
            })
            .addCase(fetchTariffs.rejected, (state) => {
                state.statusByID = Status.ERROR;
                state.tariffs = [];
            });
        builder
            .addCase(fetchTariffById.fulfilled, (state, action) => {
                state.statusByID = Status.SUCCESS;
                state.tariffById = action.payload;
            })
            .addCase(fetchTariffById.pending, (state) => {
                state.statusByID = Status.LOADING;
                state.tariffById = null;
            })
            .addCase(fetchTariffById.rejected, (state) => {
                state.tariffById = null;
                state.statusByID = Status.ERROR;
            });
        builder
            .addCase(createTariff.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(updateTariff.fulfilled, (state) => {
                state.isCreated = true;
            });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.error = action.payload;
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
