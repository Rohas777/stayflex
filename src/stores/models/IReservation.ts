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

export interface IObjectReservation {
    id: number;
    name: string;
    reservations: {
        id: number;
        start_date: string;
        end_date: string;
        status: reservationStatus;
        description: string;
        letter: string;
        client: {
            id: number;
            fullname: string;
            phone: string;
            email: string;
        };
    }[];
}
