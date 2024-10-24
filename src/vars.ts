import axios from "axios";
import * as lucideIcons from "lucide-react";

export const instance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API,
});

export type IconType = keyof typeof lucideIcons.icons;
