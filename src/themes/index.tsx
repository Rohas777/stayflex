import {
    selectTheme,
    getTheme,
    setTheme,
    themes,
    Themes,
    setLayout,
} from "@/stores/themeSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PrivateRoute from "@/components/Custom/PrivateRoute";

function Main({
    admin = false,
    guest = false,
}: {
    admin?: boolean;
    guest?: boolean;
}) {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    const Component = getTheme(theme).component;

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const switchTheme = (theme: Themes["name"]) => {
        dispatch(setTheme(theme));
    };

    useEffect(() => {
        if (guest) {
            dispatch(setLayout("without-menu"));
            return;
        }
        dispatch(setLayout("side-menu"));

        if (queryParams.get("theme")) {
            const selectedTheme = themes.find(
                (theme) => theme.name === queryParams.get("theme")
            );

            if (selectedTheme) {
                switchTheme(selectedTheme.name);
            }
        }
    }, []);

    if (guest) {
        return (
            <div>
                <Component />
            </div>
        );
    }
    return (
        <PrivateRoute type={admin ? "admin" : "user"}>
            <div>
                <ThemeSwitcher />
                <Component />
            </div>
        </PrivateRoute>
    );
}

export default Main;
