import { UserState } from "@/stores/reducers/users/types";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createUser,
    deleteUser,
    fetchAuthorizedUser,
    fetchUserById,
    fetchUsers,
    updateUserAdmin,
    updateUserIsActive,
    updateUserTariff,
} from "./actions";
import { Status } from "../types";

const initialState: UserState = {
    users: [],
    authorizedUser: null,
    status: Status.IDLE,
    statusOne: Status.IDLE,
    authorizedUserStatus: Status.IDLE,
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
            state.statusOne = Status.IDLE;
        },
        resetStatus: (state) => {
            state.status = Status.IDLE;
            state.error = null;
        },
        resetStatusOne: (state) => {
            state.statusOne = Status.IDLE;
            state.error = null;
        },
        resetStatusOnAuth: (state) => {
            state.authorizedUser = null;
            state.authorizedUserStatus = Status.IDLE;
            state.error = null;
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
            .addCase(fetchAuthorizedUser.fulfilled, (state, action) => {
                state.authorizedUser = action.payload;
                state.authorizedUserStatus = Status.SUCCESS;
                state.error = null;
            })
            .addCase(fetchAuthorizedUser.pending, (state) => {
                state.authorizedUser = null;
                state.authorizedUserStatus = Status.LOADING;
                state.error = null;
            })
            .addCase(
                fetchAuthorizedUser.rejected,
                (state, action: PayloadAction<any>) => {
                    state.authorizedUser = null;
                    state.error = action.payload;
                    state.authorizedUserStatus = Status.ERROR;
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
            .addCase(updateUserAdmin.fulfilled, (state) => {
                state.isUpdated = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(updateUserAdmin.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isUpdated = false;
            })
            .addCase(
                updateUserAdmin.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isUpdated = false;
                }
            );
        builder
            .addCase(updateUserTariff.fulfilled, (state) => {
                state.isUpdated = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(updateUserTariff.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isUpdated = false;
            })
            .addCase(
                updateUserTariff.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isUpdated = false;
                }
            );
        builder
            .addCase(updateUserIsActive.fulfilled, (state) => {
                state.isActiveStatusUpdated = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(updateUserIsActive.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isActiveStatusUpdated = false;
            })
            .addCase(
                updateUserIsActive.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isActiveStatusUpdated = false;
                }
            );
        builder
            .addCase(deleteUser.fulfilled, (state) => {
                state.isDeleted = true;
                state.status = Status.SUCCESS;
                state.error = null;
            })
            .addCase(deleteUser.pending, (state, action) => {
                state.status = Status.LOADING;
                state.error = null;
                state.isDeleted = false;
            })
            .addCase(
                deleteUser.rejected,
                (state, action: PayloadAction<any>) => {
                    state.error = action.payload;
                    state.status = Status.ERROR;
                    state.isDeleted = false;
                }
            );
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
                    state.error = action.payload;
                    state.status = Status.ERROR;
                }
            );
    },
});

export default userSlice.reducer;
