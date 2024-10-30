export interface IUser {
    mail: string;
    id: number;
    fullname: string;
    phone: string;
    tariff: {
        id: number;
        name: string;
    };
    is_active: boolean;
    is_verified: boolean;
    is_admin: boolean;
    balance: number;
    date_before: string;
    object_count: number;
}
