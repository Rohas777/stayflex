import { IconType } from "@/vars";
import { Status } from "../types";
import { IAmenity } from "@/stores/models/IAmenity";

export interface AmenityState {
    amenities: IAmenity[];
    status: Status;
    error: string | null;
    isCreated: boolean;
    isDeleted: boolean;
}

export interface AmenityCreateType {
    name: string;
    icon: IconType;
}
