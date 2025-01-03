import { reservationStatus } from "@/vars";
import { Status } from "../types";
import { IReservation } from "@/stores/models/IReservation";

export interface ReservationState {
    reservations: IReservation[];
    reservationOne: IReservation | null;
    statusAll: Status;
    statusOne: Status;
    error: string | null;
    isCreated: boolean;
    isUpdated: boolean;
    isDeleted: boolean;
}

export interface ReservationCreateType {
    start_date: string;
    end_date: string;
    object_id: number;
    client_id: number;
    description: string;
    letter: string;
    status: reservationStatus;
    adult_places: number;
    child_places: number;
}
export interface ReservationClientCreateType {
    client_data: {
        fullname: string;
        phone: string;
        email: string;
    };
    reservation_data: {
        adult_places: number;
        child_places: number;
        start_date: string;
        end_date: string;
        object_id: number;
        description: string;
    };
}
export interface ReservationUpdateType extends ReservationCreateType {
    id: number;
}
