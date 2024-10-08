import { ICity } from "./ICity";

export interface IRegion {
    id: number;
    name: string;
    cities: {
        id: number;
        name: string;
    }[];
}
