import { Status } from "../types";
import { ITariff } from "@/stores/models/ITariff";

export interface TariffState {
    tariffs: ITariff[];
    tariffById: ITariff | null;
    status: Status;
    error: string | null;
}

export interface TariffCreateType {
    name: string;
    daily_price: number;
    object_count: number;
    description: string;
}
