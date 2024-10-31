import { IClient } from "./../../models/IClient";
import { Status } from "../types";

export interface ClientState {
    clients: IClient[];
    clientByPhone: IClient | null;
    clientOne: IClient | null;
    status: Status;
    statusByPhone: Status;
    statusOne: Status;
    error: string | null;
    errorByPhone: string | null;
    isCreated: boolean;
    createdClient: IClient | null;
    isFound: boolean | null;
}

export interface ClientCreateType {
    fullname: string;
    reiting: number;
    phone: string;
    email: string;
}
