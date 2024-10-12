export interface IObject {
    name: string;
    description: string;
    price: number;
    area: string;
    room_count: number;
    bed_count: string;
    floor: string;
    min_ded: number;
    prepayment_percentage: number;
    address: string;
    id: number;
    photos: string[];
    city: {
        name: string;
        region: {
            name: string;
        };
    };
    apartment: {
        name: string;
    };
    author: {
        id: number;
        fullname: string;
        phone: string;
        mail: string;
    };
    conveniences: {
        name: string;
        photo: string;
    }[];
}
