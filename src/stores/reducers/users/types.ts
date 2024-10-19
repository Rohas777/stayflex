import { Status } from "../types";
import { IUser } from "@/stores/models/IUser";

export interface UserState {
    users: IUser[];
    status: Status;
    error: string | null;
    isCreated: boolean;
    isDeleted: boolean;
}

export interface UserCreateType {
    mail: string;
    fullname: string;
    phone: string;
    password: string;
    balance: number;
    date_before: string;
}
