import { ICity } from "@/stores/models/ICity";
import { Status } from "../types";

export interface CityState {
    cities: ICity[];
    status: Status;
    error: string | null;
}

export interface CityCreateType {
    name: string;
    regionID: number;
}
