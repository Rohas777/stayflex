import { IconType } from "@/vars";
import { Status } from "../types";
import { IHashtag } from "@/stores/models/IHashtag";

export interface HashtagState {
    hashtags: IHashtag[];
    status: Status;
    error: string | null;
    isCreated: boolean;
    isDeleted: boolean;
}

export interface HashtagCreateType {
    name: string;
}
