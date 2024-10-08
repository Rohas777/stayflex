import { DateTime } from "luxon";

export function formatDate(date: Date, format: string = "yyyy-MM-dd") {
    return DateTime.fromISO(date.toISOString()).toFormat(format);
}
