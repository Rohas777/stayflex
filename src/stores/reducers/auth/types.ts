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
    tariff_id: number;
}

export interface CodeCredentials {
    mail: string;
    code: string;
}
