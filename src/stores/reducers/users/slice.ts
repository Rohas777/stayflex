import { UserState } from "@/stores/reducers/users/types";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUser, deleteUser, fetchUsers } from "./actions";
import { Status } from "../types";

const initialState: UserState = {
    users: [],
    status: Status.LOADING,
    error: null,
    isCreated: false,
    isDeleted: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload;
        });
        // .addCase(deleteUser.fulfilled, (state, action) => {
        //     state.users = state.users.filter(
        //         (user) => user.id !== Number(action.payload)
        //     );
        // });
        builder
            .addCase(createUser.fulfilled, (state) => {
                state.isCreated = true;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.isDeleted = true;
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
