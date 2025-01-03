import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { type Themes } from "@/stores/themeSlice";
import { icons } from "@/components/Base/Lucide";
import sideMenu from "@/main/side-menu";
import adminSideMenu from "@/main/admin-side-menu";
import guestSideMenu from "@/main/guest-side-menu";
import simpleMenu from "@/main/simple-menu";
import topMenu from "@/main/top-menu";

export interface Menu {
    icon: keyof typeof icons;
    title: string;
    badge?: number;
    pathname?: string;
    subMenu?: Menu[];
    ignore?: boolean;
    mark?: "experimental" | "new";
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

    if (!authorizedUser) return guestSideMenu;
    if (isAdmin) return adminSideMenu;

    return sideMenu;
};

export default menuSlice.reducer;
