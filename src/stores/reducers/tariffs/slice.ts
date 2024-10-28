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
        resetStatus: (state) => {
            state.statusAll = Status.LOADING;
            state.error = null;
        },
        resetStatusByID: (state) => {
            state.statusByID = Status.LOADING;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTariffs.fulfilled, (state, action) => {
                state.tariffs = action.payload;
                state.statusAll = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchTariffs.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchTariffs.rejected,
                (state, action: PayloadAction<any>) => {
                    state.tariffs = [];
                    state.error = action.payload;
                    state.statusAll = Status.ERROR;
                }
            );
        builder
            .addCase(fetchTariffById.fulfilled, (state, action) => {
                state.tariffById = action.payload;
                state.statusByID = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchTariffById.pending, (state) => {
                state.statusByID = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchTariffById.rejected,
                (state, action: PayloadAction<any>) => {
                    state.tariffById = null;
                    state.error = action.payload;
                    state.statusByID = Status.ERROR;
                }
            );
        builder
            .addCase(createTariff.fulfilled, (state, action) => {
                state.tariffById = action.payload;
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createTariff.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createTariff.rejected,
                (state, action: PayloadAction<any>) => {
                    state.tariffById = null;
                    state.error = action.payload;
                    state.statusAll = Status.ERROR;
                    state.isCreated = false;
                }
            );
        builder
            .addCase(updateTariff.fulfilled, (state, action) => {
                state.tariffById = action.payload;
                state.statusAll = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(updateTariff.pending, (state) => {
                state.statusAll = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                updateTariff.rejected,
                (state, action: PayloadAction<any>) => {
                    state.tariffById = null;
                    state.error = action.payload;
                    state.statusAll = Status.ERROR;
                    state.isCreated = false;
                }
            );
    },
});

export default tariffSlice.reducer;
