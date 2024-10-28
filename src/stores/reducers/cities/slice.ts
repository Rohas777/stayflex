import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { CityState } from "./types";
import { createCity, deleteCity, fetchCities } from "./actions";

const initialState: CityState = {
    cities: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetStatus(state) {
            state.status = Status.LOADING;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.cities = action.payload.cities;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchCities.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchCities.rejected,
                (state, action: PayloadAction<any>) => {
                    state.cities = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createCity.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createCity.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createCity.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isCreated = false;
                }
            );
        builder
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteCity.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteCity.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default citySlice.reducer;
