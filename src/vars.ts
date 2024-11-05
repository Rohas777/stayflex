import axios from "axios";
import * as lucideIcons from "lucide-react";
import * as lucideLabIcons from "@lucide/lab";

export const instance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API,
});

export type reservationStatus = "new" | "approved" | "rejected" | "completed";
export const reservationStatuses: reservationStatus[] = [
    "new",
    "approved",
    "rejected",
];
export const reservationStatusesFull: reservationStatus[] = [
    ...reservationStatuses,
    "completed",
];
export const reservationStatusesWithNames: {
    value: reservationStatus;
    label: string;
}[] = [
    {
        value: "new",
        label: "Новая",
    },
    {
        value: "approved",
        label: "Одобрена",
    },
    {
        value: "rejected",
        label: "Отклонена",
    },
];
export const reservationStatusesFullWithNames: {
    value: reservationStatus;
    label: string;
}[] = [
    ...reservationStatusesWithNames,
    {
        value: "completed",
        label: "Завершена",
    },
];

export type IconType =
    | keyof typeof lucideIcons.icons
    | keyof typeof lucideLabIcons;
