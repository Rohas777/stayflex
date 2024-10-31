import { Status } from "../types";
import { IUser } from "@/stores/models/IUser";

export interface UserState {
    users: IUser[];
    userOne: IUser | null;
    authorizedUser: IUser | null;
    authorizedUserStatus: Status;
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
    tariff_id: number;
    is_admin?: boolean; //FIXME -
}
export interface UserUpdateType {
    mail: string;
    fullname: string;
    phone: string;
    id: number;
}
export interface UserTariffUpdateType {
    user_id: number;
    tariff_id: number;
    balance: number;
}
