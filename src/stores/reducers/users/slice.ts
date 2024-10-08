import { UserState } from "@/stores/reducers/users/types";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteUser, fetchUsers } from "./actions";
import { Status } from "../types";

const initialState: UserState = {
    users: [],
    status: Status.LOADING,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload.users;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (user) => user.id !== Number(action.payload)
                );
            });
        builder
            .addMatcher(isPending, (state) => {
                state.users = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
                state.users = [];
                state.error = action.payload;
                state.status = Status.ERROR;
            });
    },
});

export default userSlice.reducer;

const isRejected = (action: AnyAction) => {
    return action.type.endsWith("rejected");
};
const isFulfilled = (action: AnyAction) => {
    return action.type.endsWith("fulfilled");
};
const isPending = (action: AnyAction) => {
    return action.type.endsWith("pending");
};
