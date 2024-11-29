import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/components/mobile-menu.css";
import { Transition } from "react-transition-group";
import { useState, useEffect, createRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toRaw } from "@/utils/helper";
import { selectMenu } from "@/stores/menuSlice";
import { selectTheme } from "@/stores/themeSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./mobile-menu";
import Lucide from "@/components/Base/Lucide";
import logoUrl from "@/assets/images/logo.svg";
import clsx from "clsx";
import SimpleBar from "simplebar";
import { useClickAway } from "ahooks";
import Icon from "../Custom/Icon";
import { Menu } from "../Base/Headless";
import { startLoader } from "@/utils/customUtils";
import { preferencesSlice } from "@/stores/preferencesSlice";
import { logout } from "@/stores/reducers/auth/actions";

function Main() {
    const { authorizedUser } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [formattedMenu, setFormattedMenu] = useState<
        Array<FormattedMenu | "divider">
    >([]);
    const themeStore = useAppSelector(selectTheme);
    const menuStore = useAppSelector(selectMenu(themeStore.layout));
    const menu = () => nestedMenu(toRaw(menuStore), location);
    const [activeMobileMenu, setActiveMobileMenu] = useState(false);
    const scrollableRef = createRef<HTMLDivElement>();
    const mobileMenuOpenRef = createRef<HTMLAnchorElement>();

    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const { setPreferencesSlideover } = preferencesSlice.actions;

    useClickAway(
        (e) => {
            if (
                activeMobileMenu &&
                mobileMenuOpenRef.current?.contains(e.target as Node) === false
            ) {
                setActiveMobileMenu(false);
            }
        },
        () => document.getElementsByClassName("simplebar-wrapper")[0]
    );
    const onLogout = () => {
        startLoader(setIsLoaderOpen);
        dispatch(logout());
    };

    const openPreferencesSlideover = () => {
        dispatch(setPreferencesSlideover(true));
    };

    useEffect(() => {
        if (scrollableRef.current) {
            new SimpleBar(scrollableRef.current);
        }
        setFormattedMenu(menu());
    }, [menuStore, location.pathname]);

    return (
        <>
            {/* BEGIN: Mobile Menu */}
            <div
                className={clsx([
                    "mobile-menu group top-0 inset-x-0 fixed bg-theme-1/90 z-[60] border-b border-white/[0.08] dark:bg-darkmode-800/90 md:hidden",
                    "before:content-[''] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out",
                    "before:invisible before:opacity-0",
                    "[&.mobile-menu--active]:before:visible [&.mobile-menu--active]:before:opacity-100",
                    activeMobileMenu && "mobile-menu--active",
                ])}
            >
                <div className="h-[70px] px-3 sm:px-8 flex items-center">
                    <a href="" className="flex mr-auto">
                        <img className="w-20" src={logoUrl} />
                    </a>

                    <Menu className="block md:hidden mr-2">
                        <Menu.Button className="flex items-center justify-center transition bg-slate-300 w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
                            <Lucide icon="User" />
                        </Menu.Button>
                        <Menu.Items className="w-56 mt-px text-white bg-primary">
                            <Menu.Header className="font-normal">
                                <div className="font-medium">
                                    {authorizedUser?.fullname}
                                </div>
                                {!authorizedUser?.is_admin && (
                                    <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                                        Баланс: {authorizedUser?.balance}
                                    </div>
                                )}
                            </Menu.Header>
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item className="hover:bg-white/5">
                                <Link
                                    to={
                                        (authorizedUser?.is_admin
                                            ? "/admin"
                                            : "") + `/profile`
                                    }
                                    className="flex items-center w-full"
                                >
                                    <Lucide
                                        icon="User"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Профиль
                                </Link>
                            </Menu.Item>
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item
                                onClick={openPreferencesSlideover}
                                className="hover:bg-white/5"
                            >
                                <Lucide icon="Cog" className="w-4 h-4 mr-2" />{" "}
                                Настройки
                            </Menu.Item>
                            {/* <Menu.Item className="hover:bg-white/5">
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Reset Password
                        </Menu.Item> */}
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item
                                onClick={onLogout}
                                className="hover:bg-white/5"
                            >
                                <Lucide
                                    icon="LogOut"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Выйти
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                    <a
                        id="mobile-menu-open"
                        ref={mobileMenuOpenRef}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Lucide
                            icon="BarChart2"
                            className="w-8 h-8 text-white transform -rotate-90"
                            onClick={() => {
                                setActiveMobileMenu(!activeMobileMenu);
                            }}
                        />
                    </a>
                </div>
                <div
                    ref={scrollableRef}
                    className={clsx([
                        "h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800",
                        "[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50",
                        "group-[.mobile-menu--active]:ml-0",
                    ])}
                >
                    <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className={clsx([
                            "fixed top-0 right-0 mt-4 mr-4 transition-opacity duration-200 ease-in-out",
                            "invisible opacity-0",
                            "group-[.mobile-menu--active]:visible group-[.mobile-menu--active]:opacity-100",
                        ])}
                    >
                        <Lucide
                            icon="XCircle"
                            className="w-8 h-8 text-white transform -rotate-90"
                            onClick={() => {
                                setActiveMobileMenu(!activeMobileMenu);
                            }}
                        />
                    </a>
                    <ul id="mobile-menu-content" className="py-2">
                        {/* BEGIN: First Child */}
                        {formattedMenu.map((menu, menuKey) =>
                            menu == "divider" ? (
                                <li
                                    className="my-6 menu__divider"
                                    key={menuKey}
                                ></li>
                            ) : (
                                <li key={menuKey}>
                                    <a
                                        href={
                                            menu.subMenu ? "#" : menu.pathname
                                        }
                                        className={clsx([
                                            menu.active
                                                ? "menu menu--active"
                                                : "menu",
                                        ])}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(
                                                menu,
                                                navigate,
                                                setActiveMobileMenu
                                            );
                                            setFormattedMenu([
                                                ...formattedMenu,
                                            ]);
                                        }}
                                    >
                                        <div className="menu__icon">
                                            <Lucide icon={menu.icon} />
                                        </div>
                                        <div className="menu__title">
                                            {menu.title}
                                            {menu.mark &&
                                                menu.mark ===
                                                    "experimental" && (
                                                    <Icon
                                                        icon="FlaskConical"
                                                        className="size-4 text-pending ml-2 mb-3 menu-mark"
                                                    />
                                                )}
                                            {menu.subMenu && (
                                                <div
                                                    className={clsx([
                                                        "menu__sub-icon",
                                                        menu.activeDropdown &&
                                                            "transform rotate-180",
                                                    ])}
                                                >
                                                    <Lucide icon="ChevronDown" />
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                    {/* BEGIN: Second Child */}
                                    {menu.subMenu && (
                                        <Transition
                                            in={menu.activeDropdown}
                                            onEnter={enter}
                                            onExit={leave}
                                            timeout={300}
                                        >
                                            <ul
                                                className={clsx({
                                                    "menu__sub-open":
                                                        menu.activeDropdown,
                                                })}
                                            >
                                                {menu.subMenu.map(
                                                    (subMenu, subMenuKey) => (
                                                        <li key={subMenuKey}>
                                                            <a
                                                                href={
                                                                    subMenu.subMenu
                                                                        ? "#"
                                                                        : subMenu.pathname
                                                                }
                                                                className={clsx(
                                                                    [
                                                                        subMenu.active
                                                                            ? "menu menu--active"
                                                                            : "menu",
                                                                    ]
                                                                )}
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.preventDefault();
                                                                    linkTo(
                                                                        subMenu,
                                                                        navigate,
                                                                        setActiveMobileMenu
                                                                    );
                                                                    setFormattedMenu(
                                                                        [
                                                                            ...formattedMenu,
                                                                        ]
                                                                    );
                                                                }}
                                                            >
                                                                <div className="menu__icon">
                                                                    <Lucide
                                                                        icon={
                                                                            subMenu.icon
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="menu__title">
                                                                    {
                                                                        subMenu.title
                                                                    }
                                                                    {subMenu.mark &&
                                                                        subMenu.mark ===
                                                                            "experimental" && (
                                                                            <Icon
                                                                                icon="FlaskConical"
                                                                                className="size-4 text-pending ml-2 mb-3 menu-mark"
                                                                            />
                                                                        )}
                                                                    {subMenu.subMenu && (
                                                                        <div
                                                                            className={clsx(
                                                                                [
                                                                                    "menu__sub-icon",
                                                                                    subMenu.activeDropdown &&
                                                                                        "transform rotate-180",
                                                                                ]
                                                                            )}
                                                                        >
                                                                            <Lucide icon="ChevronDown" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </a>
                                                            {/* BEGIN: Third Child */}
                                                            {subMenu.subMenu && (
                                                                <Transition
                                                                    in={
                                                                        subMenu.activeDropdown
                                                                    }
                                                                    onEnter={
                                                                        enter
                                                                    }
                                                                    onExit={
                                                                        leave
                                                                    }
                                                                    timeout={
                                                                        300
                                                                    }
                                                                >
                                                                    <ul
                                                                        className={clsx(
                                                                            {
                                                                                "menu__sub-open":
                                                                                    subMenu.activeDropdown,
                                                                            }
                                                                        )}
                                                                    >
                                                                        {subMenu.subMenu.map(
                                                                            (
                                                                                lastSubMenu,
                                                                                lastSubMenuKey
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        lastSubMenuKey
                                                                                    }
                                                                                >
                                                                                    <a
                                                                                        href={
                                                                                            lastSubMenu.subMenu
                                                                                                ? "#"
                                                                                                : lastSubMenu.pathname
                                                                                        }
                                                                                        className={clsx(
                                                                                            [
                                                                                                lastSubMenu.active
                                                                                                    ? "menu menu--active"
                                                                                                    : "menu",
                                                                                            ]
                                                                                        )}
                                                                                        onClick={(
                                                                                            event
                                                                                        ) => {
                                                                                            event.preventDefault();
                                                                                            linkTo(
                                                                                                lastSubMenu,
                                                                                                navigate,
                                                                                                setActiveMobileMenu
                                                                                            );
                                                                                            setFormattedMenu(
                                                                                                [
                                                                                                    ...formattedMenu,
                                                                                                ]
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <div className="menu__icon">
                                                                                            <Lucide
                                                                                                icon={
                                                                                                    lastSubMenu.icon
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <div className="menu__title">
                                                                                            {
                                                                                                lastSubMenu.title
                                                                                            }
                                                                                            {lastSubMenu.mark &&
                                                                                                lastSubMenu.mark ===
                                                                                                    "experimental" && (
                                                                                                    <Icon
                                                                                                        icon="FlaskConical"
                                                                                                        className="size-4 text-pending ml-2 mb-3 menu-mark"
                                                                                                    />
                                                                                                )}
                                                                                        </div>
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </Transition>
                                                            )}
                                                            {/* END: Third Child */}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </Transition>
                                    )}
                                    {/* END: Second Child */}
                                </li>
                            )
                        )}
                        {/* END: First Child */}
                    </ul>
                </div>
            </div>
            {/* END: Mobile Menu */}
        </>
    );
}

export default Main;
