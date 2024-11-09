import { IRegion } from "@/stores/models/IRegion";
import { Status } from "../types";

export interface RegionState {
    regions: IRegion[];
    status: Status;
    error: string | null;
    isCreated: boolean;
    isDeleted: boolean;
}

export interface RegionCreateType {
    name: string;
    server_id: number;
}
