import { reservationStatus } from "@/vars";

export interface IReservation {
    start_date: string;
    end_date: string;
    id: number;
    status: reservationStatus;
    description: string;
    letter: string;
    client: {
        id: number;
        fullname: string;
        phone: string;
        email: string;
    };
    object: {
        id: number;
        name: string;
    };
}
