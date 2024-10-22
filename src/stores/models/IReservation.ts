export interface IReservation {
    start_date: string;
    end_date: string;
    id: number;
    status: string;
    description: string;
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
