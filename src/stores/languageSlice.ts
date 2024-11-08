import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const savedLanguage = localStorage.getItem("language") || "ru";

export interface LanguageState {
    language: string;
}

const initialState = {
    language: savedLanguage,
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem("language", action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;

export const selectLanguage = (state: RootState) => state.language;

export default languageSlice.reducer;
