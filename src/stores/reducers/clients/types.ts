import { IClient } from "./../../models/IClient";
import { Status } from "../types";

export interface ClientState {
    clients: IClient[];
    clientByPhone: IClient | null;
    status: Status;
    statusByPhone: Status;
    error: string | null;
    errorByPhone: string | null;
    isCreated: boolean;
}

export interface ClientCreateType {
    client_data: {
        fullname: string;
        reiting: number;
        phone: string;
        email: string;
    };
    user_id: number;
}
