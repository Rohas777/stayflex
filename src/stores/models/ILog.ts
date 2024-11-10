export interface ILog {
    id: number;
    created_at: string;
    description: string;
    user: {
        fullname: string;
        is_admin: boolean;
        id: number;
    };
}
