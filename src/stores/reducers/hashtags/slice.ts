import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { HashtagState } from "./types";
import { createHashtag, deleteHashtag, fetchHashtags } from "./actions";

const initialState: HashtagState = {
    hashtags: [],
    status: Status.IDLE,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const hashtagSlice = createSlice({
    name: "hashtag",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetStatus(state) {
            state.status = Status.IDLE;
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchHashtags.fulfilled, (state, action) => {
                state.hashtags = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchHashtags.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchHashtags.rejected,
                (state, action: PayloadAction<any>) => {
                    state.hashtags = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(createHashtag.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isCreated = true;
            })
            .addCase(createHashtag.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isCreated = false;
            })
            .addCase(
                createHashtag.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isCreated = false;
                }
            );

        builder
            .addCase(deleteHashtag.fulfilled, (state, action) => {
                state.status = Status.SUCCESS;
                state.error = null;
                state.isDeleted = true;
            })
            .addCase(deleteHashtag.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteHashtag.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
    },
});

export default hashtagSlice.reducer;
