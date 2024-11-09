import { Status } from "../types";
import { IServer } from "@/stores/models/IServer";

export interface ServerState {
    servers: IServer[];
    status: Status;
    statusAction: Status;
    error: string | null;
    isCreated: boolean;
    isSetDefault: boolean;
    isDeleted: boolean;
    isUpdated: boolean;
}

export interface ServerCreateType {
    name: string;
    container_name: string;
    link: string;
}

export interface ServerUpdateType extends ServerCreateType {
    id: number;
}
