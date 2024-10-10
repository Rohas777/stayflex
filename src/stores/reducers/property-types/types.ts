import { Status } from "../types";
import { IPropertyType } from "@/stores/models/IPropertyType";

export interface PropertyTypeState {
    propertyTypes: IPropertyType[];
    status: Status;
    error: string | null;
}

export interface PropertyTypeCreateType {
    name: string;
}
