import axios from "axios";
import * as lucideIcons from "lucide-react";

export const instance = axios.create({
    withCredentials: false, //NOTE - Разобратья
    // baseURL: "http://127.0.0.1:8000/",
    baseURL: import.meta.env.VITE_API,
});

export type IconType = keyof typeof lucideIcons.icons;
