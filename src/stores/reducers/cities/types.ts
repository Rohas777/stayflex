import { ICity } from "@/stores/models/ICity";
import { Status } from "../types";

export interface CityState {
    cities: ICity[];
    status: Status;
    error: string | null;
    isCreated: boolean;
    isDeleted: boolean;
}

export interface CityCreateType {
    name: string;
    region_id: number;
}
