import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface DarkModeState {
    isError: boolean;
    message: string | null;
}

const initialState: DarkModeState = {
    isError: false,
    message: null,
};

export const errorToastSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        setErrorToast: (
            state,
            action: PayloadAction<{ isError: boolean; message: string | null }>
        ) => {
            if (action.payload.isError) {
                state.message = action.payload.message;
                state.isError = true;
            } else {
                state.message = null;
                state.isError = false;
            }
        },
    },
});

export const { setErrorToast } = errorToastSlice.actions;

export default errorToastSlice.reducer;
