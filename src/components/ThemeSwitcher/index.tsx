import enFlag from "/src/assets/images/flags/eng.svg";
import ruFlag from "/src/assets/images/flags/rus.svg";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    selectColorScheme,
    setColorScheme,
    ColorSchemes,
} from "@/stores/colorSchemeSlice";
import { selectTheme, setTheme, setLayout, Themes } from "@/stores/themeSlice";
import { selectDarkMode, setDarkMode } from "@/stores/darkModeSlice";
import { Slideover } from "@/components/Base/Headless";
import Lucide from "@/components/Base/Lucide";
import { useRef, useState } from "react";
import clsx from "clsx";
import Tippy from "@/components/Base/Tippy";
import TippyContent from "@/components/Base/TippyContent";
import { preferencesSlice } from "@/stores/preferencesSlice";
import Icon from "../Custom/Icon";
import LanguageSwitcher from "../Custom/LangSwitcher";

function Main() {
    const dispatch = useAppDispatch();

    const activeColorScheme = useAppSelector(selectColorScheme);
    const activeDarkMode = useAppSelector(selectDarkMode);
    const preferencesState = useAppSelector((state) => state.preferences);
    const { setPreferencesSlideover } = preferencesSlice.actions;

    const setColorSchemeClass = () => {
        const el = document.querySelectorAll("html")[0];
        el.setAttribute("class", activeColorScheme);
        activeDarkMode && el.classList.add("dark");
    };
    const switchColorScheme = (colorScheme: ColorSchemes) => {
        dispatch(setColorScheme(colorScheme));
        setColorSchemeClass();
    };
    setColorSchemeClass();

    const setDarkModeClass = () => {
        const el = document.querySelectorAll("html")[0];
        activeDarkMode ? el.classList.add("dark") : el.classList.remove("dark");
    };
    const switchDarkMode = (darkMode: boolean) => {
        dispatch(setDarkMode(darkMode));
        setDarkModeClass();
    };
    setDarkModeClass();

    const themes: Array<Themes["name"]> = [
        "rubick",
        "icewall",
        "tinker",
        "enigma",
    ];
    const layouts: Array<Themes["layout"]> = [
        "side-menu",
        "simple-menu",
        "top-menu",
    ];
    const colorSchemes: Array<ColorSchemes> = [
        "default",
        "theme-1",
        "theme-2",
        "theme-3",
    ];

    const themeImages = import.meta.glob<{
        default: string;
    }>("/src/assets/images/themes/*.{jpg,jpeg,png,svg}", { eager: true });
    const layoutImages = import.meta.glob<{
        default: string;
    }>("/src/assets/images/layouts/*.{jpg,jpeg,png,svg}", { eager: true });

    return (
        <div>
            <Slideover
                open={preferencesState.isOpen}
                onClose={() => {
                    dispatch(setPreferencesSlideover(false));
                }}
            >
                <Slideover.Panel className="w-72 rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem]">
                    <a
                        href=""
                        className="focus:outline-none hover:bg-white/10 bg-white/5 transition-all hover:rotate-180 fixed top-0 left-0 md:absolute md:inset-y-0 md:right-auto md:-ml-[105px] md:size-[56px] md:my-auto flex items-center justify-center mt-4 ml-4 border rounded-full text-white/90 w-8 h-8 border-white/90 hover:scale-105"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(setPreferencesSlideover(false));
                        }}
                    >
                        <Lucide className="w-6 h-6" icon="X" />
                    </a>
                    <Slideover.Description className="p-0">
                        <div className="flex flex-col">
                            {/* <div className="px-8 pt-6 pb-8">
                                <div className="text-base font-medium">
                                    Язык системы
                                </div>
                                <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3.5">
                                    <div>
                                        <a
                                            // onClick={() =>
                                            //     switchDarkMode(false)
                                            // }
                                            className={clsx([
                                                "aspect-square overflow-hidden rounded-md cursor-pointer bg-slate-200 box p-1 border-slate-300/80 block",
                                                "[&.active]:border-2 [&.active]:border-theme-1/60",
                                                !activeDarkMode ? "active" : "",
                                            ])}
                                        >
                                            <div className="h-full image-fit">
                                                <img src={ruFlag} alt="Ru" />
                                            </div>
                                        </a>
                                        <div className="mt-2.5 text-center text-xs capitalize">
                                            Русский
                                        </div>
                                    </div>
                                    <div>
                                        <Tippy content="В разработке">
                                            <a
                                                // onClick={() => switchDarkMode(true)}
                                                className={clsx([
                                                    "aspect-square rounded-md overflow-hidden cursor-not-allowed bg-slate-200 box p-1 border-slate-300/80 block",
                                                    "[&.active]:border-2 [&.active]:border-theme-1/60",
                                                    activeDarkMode
                                                        ? "active"
                                                        : "",
                                                ])}
                                            >
                                                <div className="h-full image-fit">
                                                    <img
                                                        src={enFlag}
                                                        alt="En"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 size-full bg-slate-200 bg-opacity-70"></div>
                                                <Icon
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 stroke-2"
                                                    icon="Wrench"
                                                />
                                            </a>
                                        </Tippy>
                                        <div className="mt-2.5 text-center text-xs capitalize">
                                            Английский
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <LanguageSwitcher />
                            <div className="border-b border-dashed"></div>
                            <div className="px-8 pt-6 pb-8">
                                <div className="text-base font-medium">
                                    Тема
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-3.5">
                                    <div>
                                        <a
                                            onClick={() =>
                                                switchDarkMode(false)
                                            }
                                            className={clsx([
                                                "h-12 cursor-pointer bg-slate-50 box p-1 border-slate-300/80 block",
                                                "[&.active]:border-2 [&.active]:border-theme-1/60",
                                                !activeDarkMode ? "active" : "",
                                            ])}
                                        >
                                            <div className="h-full overflow-hidden rounded-md bg-slate-200"></div>
                                        </a>
                                        <div className="mt-2.5 text-center text-xs capitalize">
                                            Светлая
                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            onClick={() => switchDarkMode(true)}
                                            className={clsx([
                                                "h-12 cursor-pointer bg-slate-50 box p-1 border-slate-300/80 block",
                                                "[&.active]:border-2 [&.active]:border-theme-1/60",
                                                activeDarkMode ? "active" : "",
                                            ])}
                                        >
                                            <div className="h-full overflow-hidden rounded-md bg-slate-900"></div>
                                        </a>
                                        <div className="mt-2.5 text-center text-xs capitalize">
                                            Тёмная
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-dashed"></div>
                            <div className="px-8 pt-6 pb-8">
                                <div className="text-base font-medium">
                                    Цвета
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3.5 mt-5">
                                    {colorSchemes.map(
                                        (colorScheme, colorKey) => (
                                            <div key={colorKey}>
                                                <div
                                                    onClick={() =>
                                                        switchColorScheme(
                                                            colorScheme
                                                        )
                                                    }
                                                    className={clsx([
                                                        "h-12 cursor-pointer bg-slate-50 box rounded-full p-1 border-slate-300/80",
                                                        activeColorScheme ==
                                                            colorScheme &&
                                                            "border-2 border-theme-1/60",
                                                    ])}
                                                >
                                                    <div className="h-full overflow-hidden rounded-full">
                                                        <div className="flex items-center h-full gap-1 -mx-2">
                                                            <div
                                                                className={clsx(
                                                                    [
                                                                        "w-1/2 h-[140%] bg-theme-1 rotate-12",
                                                                        colorScheme,
                                                                    ]
                                                                )}
                                                            ></div>
                                                            <div
                                                                className={clsx(
                                                                    [
                                                                        "w-1/2 h-[140%] bg-theme-2 rotate-12",
                                                                        colorScheme,
                                                                    ]
                                                                )}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Slideover.Description>
                </Slideover.Panel>
            </Slideover>
        </div>
    );
}

export default Main;
