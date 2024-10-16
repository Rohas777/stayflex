import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../types";
import { ObjectState } from "./types";
import { createObject, fetchObjects } from "./actions";

const initialState: ObjectState = {
    objects: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
};

export const objectSlice = createSlice({
    name: "object",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchObjects.fulfilled, (state, action) => {
            state.objects = action.payload;
        });
        builder
            .addCase(createObject.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(createObject.rejected, (state) => {
                state.isCreated = false;
            });
        // .addCase(deletUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addMatcher(isPending, (state) => {
                state.objects = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.objects = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default objectSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
