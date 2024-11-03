import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PreferencesSlideoverState {
    isOpen: boolean;
}

const initialState: PreferencesSlideoverState = {
    isOpen: false,
};

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setPreferencesSlideover: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

export const { setPreferencesSlideover } = preferencesSlice.actions;

export default preferencesSlice.reducer;
