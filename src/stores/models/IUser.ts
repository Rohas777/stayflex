export interface IUser {
    mail: string;
    id: number;
    fullname: string;
    phone: string;
    tarif: string;
    is_active: boolean;
    is_verified: boolean;
    is_admin: boolean;
    balance: number;
    date_before: string;
}
