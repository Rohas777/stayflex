import { IRegion } from "@/stores/models/IRegion";
import { Status } from "../types";

export interface RegionState {
    regions: IRegion[];
    status: Status;
    error: string | null;
}

export interface RegionCreateType {
    name: string;
}
