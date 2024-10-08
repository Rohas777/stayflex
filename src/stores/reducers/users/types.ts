import { Status } from "../types";
import { IUser } from "@/stores/models/IUser";

export interface UserState {
    users: IUser[];
    status: Status;
    error: string | null;
}
