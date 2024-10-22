import { UserState } from "@/stores/reducers/users/types";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createUser,
    deleteUser,
    fetchUserById,
    fetchUsers,
    updateUserIsActive,
} from "./actions";
import { Status } from "../types";

const initialState: UserState = {
    users: [],
    status: Status.LOADING,
    statusOne: Status.LOADING,
    userOne: null,
    isActiveStatusUpdated: false,
    error: null,
    isCreated: false,
    isDeleted: false,
    isUpdated: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetIsCreated: (state) => {
            state.isCreated = false;
        },
        resetIsUpdated: (state) => {
            state.isUpdated = false;
        },
        resetIsDeleted: (state) => {
            state.isDeleted = false;
        },
        resetIsActiveStatusUpdated: (state) => {
            state.isActiveStatusUpdated = false;
        },
        resetUserOne: (state) => {
            state.userOne = null;
            state.statusOne = Status.LOADING;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.users = [];
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchUsers.rejected,
                (state, action: PayloadAction<any>) => {
                    state.users = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
        builder
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.userOne = action.payload;
                state.statusOne = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.userOne = null;
                state.statusOne = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchUserById.rejected,
                (state, action: PayloadAction<any>) => {
                    state.userOne = null;
                    state.error = action.payload;
                    state.statusOne = Status.ERROR;
                }
            );

        builder
            .addCase(updateUserIsActive.fulfilled, (state) => {
                state.isActiveStatusUpdated = true;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.isDeleted = true;
            });
        builder
            .addCase(createUser.fulfilled, (state) => {
                state.isCreated = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(createUser.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(
                createUser.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isCreated = false;
                    state.users = [];
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
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
