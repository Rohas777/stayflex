import { IMail } from "@/stores/models/IMail";
import { Status } from "../types";

export interface MailState {
    mails: IMail[];
    status: Status;
    error: string | null;
}
