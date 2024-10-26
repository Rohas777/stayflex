import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { type Themes } from "@/stores/themeSlice";
import { icons } from "@/components/Base/Lucide";
import sideMenu from "@/main/side-menu";
import adminSideMenu from "@/main/admin-side-menu";
import simpleMenu from "@/main/simple-menu";
import topMenu from "@/main/top-menu";
import { useAppSelector } from "./hooks";
import { IUser } from "./models/IUser";
import { fetchAuthorizedUser } from "./reducers/users/actions";
import { Status } from "./reducers/types";
import { useEffect } from "react";

export interface Menu {
    icon: keyof typeof icons;
    title: string;
    badge?: number;
    pathname?: string;
    subMenu?: Menu[];
    ignore?: boolean;
}

export interface MenuState {
    menu: Array<Menu | string>;
}

const initialState: MenuState = {
    menu: [],
};

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
});

export const selectMenu = (layout: Themes["layout"]) => (state: RootState) => {
    if (layout == "top-menu") {
        return topMenu;
    }

    const authorizedUser = state.user.authorizedUser;
    if (layout == "simple-menu") {
        return simpleMenu;
    }

    const isAdmin = !!authorizedUser ? authorizedUser?.is_admin : false;

    if (isAdmin) return adminSideMenu;

    return sideMenu;
};

export default menuSlice.reducer;
