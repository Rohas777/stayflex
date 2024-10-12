import { IObject } from "./../../models/IObject";
import { Status } from "../types";

export interface ObjectState {
    objects: IObject[];
    status: Status;
    error: string | null;
}

export interface ObjectCreateType {
    apartment_id: number;
    price: number;
    room_count: number;
    name: string;
    floor: string;
    area: string;
    city_id: number;
    bed_count: string;
    address: string;
    min_ded: number;
    prepayment_percentage: number;
    convenience: number[];
    description: string;
}
