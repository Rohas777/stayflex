import { IObject } from "./../../models/IObject";
import { Status } from "../types";

export interface ObjectState {
    objects: IObject[];
    status: Status;
    error: string | null;
    isCreated: boolean;
}

export interface ObjectCreateType {
    apartment_id: number;
    price: number;
    room_count: number;
    name: string;
    floor: string;
    area: string;
    city_id: number;
    child_places: number;
    adult_places: number;
    address: string;
    min_ded: number;
    prepayment_percentage: number;
    amenity: number[];
    description: string;
}

export interface ObjectCreateBodyType {
    object_data: string;
    files: File[];
}
