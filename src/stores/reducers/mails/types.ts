import { IMail } from "@/stores/models/IMail";
import { Status } from "../types";

export interface MailState {
    mails: IMail[];
    status: Status;
    statusActions: Status;
    error: string | null;
    isUpdated: boolean;
    isSended: boolean;
}

export interface UpdateMail {
    slug: string;
    name: string;
    subject: string;
    description: string;
}

export interface SendMail {
    user_mail: string;
    subject: string;
    description: string;
}
