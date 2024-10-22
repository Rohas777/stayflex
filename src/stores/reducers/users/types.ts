import { Status } from "../types";
import { IUser } from "@/stores/models/IUser";

export interface UserState {
    users: IUser[];
    userOne: IUser | null;
    status: Status;
    statusOne: Status;
    error: string | null;
    isCreated: boolean;
    isActiveStatusUpdated: boolean;
    isDeleted: boolean;
    isUpdated: boolean;
}

export interface UserCreateType {
    mail: string;
    fullname: string;
    phone: string;
    password: string;
    balance: number;
    is_active: boolean;
    is_verified: boolean;
}
