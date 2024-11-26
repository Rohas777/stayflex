import { reservationStatus } from "@/vars";

export interface IReservation {
    start_date: string;
    end_date: string;
    id: number;
    status: reservationStatus;
    description: string;
    letter: string;
    adult_places: number;
    child_places: number;
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
        adult_places: number;
        child_places: number;
        order?: number;
        client: {
            id: number;
            fullname: string;
            phone: string;
            email: string;
        };
    }[];
}
