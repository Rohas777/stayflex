import { Status } from "../types";
import { IReservation } from "@/stores/models/IReservation";

export interface ReservationState {
    reservations: IReservation[];
    reservationById: IReservation | null;
    statusAll: Status;
    statusByID: Status;
    error: string | null;
    isCreated: boolean;
    isUpdated: boolean;
}

export interface ReservationCreateType {
    start_date: string;
    end_date: string;
    object_id: number;
    client_id: number;
    description: string;
}
export interface ReservationUpdateType extends ReservationCreateType {
    id: number;
}
