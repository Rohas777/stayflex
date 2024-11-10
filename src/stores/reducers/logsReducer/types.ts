import { ILog } from "@/stores/models/ILog";
import { Status } from "../types";

export interface LogState {
    logs: ILog[];
    status: Status;
    error: string | null;
}
