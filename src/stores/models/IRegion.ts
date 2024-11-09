import { ICity } from "./ICity";

export interface IRegion {
    id: number;
    name: string;
    object_count: number;
    cities: {
        id: number;
        name: string;
    }[];
    servers: {
        id: number;
        name: string;
    };
}
