import { Status } from "../types";
import { IUser } from "@/stores/models/IUser";

export interface AuthState {
    user: IUser | null;
    authTempUser: any | null;
    status: Status;
    signInStatus: Status;
    signUpStatus: Status;
    codeStatus: Status;
    error: string | null;
}

export interface SignInCredentials {
    mail: string;
    password: string;
}

export interface SignUpCredentials {
    fullname: string;
    phone: string;
    mail: string;
    password: string;
    is_active: boolean;
    is_verified: boolean;
    is_admin: boolean;
    balance: number;
    date_before: string;
}

export interface CodeCredentials {
    mail: string;
    code: string;
}
