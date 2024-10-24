export interface IObject {
    name: string;
    description: string;
    price: number;
    area: string;
    room_count: number;
    child_places: number;
    adult_places: number;
    floor: string;
    min_ded: number;
    prepayment_percentage: number;
    address: string;
    id: number;
    photos: string[];
    active: boolean;
    city: {
        id: number;
        name: string;
        region: {
            name: string;
            id: number;
        };
    };
    apartment: {
        id: number;
        name: string;
    };
    author: {
        id: number;
        fullname: string;
        phone: string;
        mail: string;
    };
    conveniences: {
        id: number;
        name: string;
        photo: string;
    }[];
}
