import { icons } from "@/components/Base/Lucide";
import { Status } from "../types";
import { ITariff } from "@/stores/models/ITariff";

export interface TariffState {
    tariffs: ITariff[];
    tariffById: ITariff | null;
    statusAll: Status;
    statusByID: Status;
    error: string | null;
    isCreated: boolean;
    isActivated: boolean;
}

export interface TariffCreateType {
    icon: string;
    name: string;
    daily_price: number;
    object_count: number;
    description: string;
}
export interface TariffUpdateType extends TariffCreateType {
    id: number;
}
