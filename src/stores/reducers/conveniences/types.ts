import { Status } from "../types";
import { IConvenience } from "@/stores/models/IConvenience";

export interface ConvenienceState {
    conveniences: IConvenience[];
    status: Status;
    error: string | null;
}

export interface ConvenienceCreateType {
    convenience_name: string;
    file: File;
}
