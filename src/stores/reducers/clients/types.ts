import { IClient } from "./../../models/IClient";
import { Status } from "../types";

export interface ClientState {
    clients: IClient[];
    status: Status;
    error: string | null;
}
