import { Status } from "../types";
import { IReservation } from "@/stores/models/IReservation";

export interface ReservationState {
    reservations: IReservation[];
    reservationById: IReservation | null;
    statusAll: Status;
    statusByID: Status;
    error: string | null;
    isCreated: boolean;
}

export interface ReservationCreateType {
    icon: string;
    name: string;
    daily_price: number;
    object_count: number;
    description: string;
}
export interface ReservationUpdateType extends ReservationCreateType {
    id: number;
}
