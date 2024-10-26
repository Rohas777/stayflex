import { useState, Fragment, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { FormInput } from "@/components/Base/Form";
import { Menu, Popover } from "@/components/Base/Headless";
import fakerData from "@/utils/faker";
import _ from "lodash";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { startLoader } from "@/utils/customUtils";
import { logout } from "@/stores/reducers/auth/actions";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

function Main() {
    const [searchDropdown, setSearchDropdown] = useState(false);
    const [pathname, setPathname] = useState("");
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const showSearchDropdown = () => {
        setSearchDropdown(true);
    };
    const hideSearchDropdown = () => {
        setSearchDropdown(false);
    };
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { authorizedUser } = useAppSelector((state) => state.user);

    const onLogout = () => {
        startLoader(setIsLoaderOpen);
        dispatch(logout());
    };

    useEffect(() => {
        if (location.pathname !== "/") {
            const originalPathname = location.pathname;
            const formattedPathname = originalPathname
                .replaceAll("/", "")
                .replaceAll("-", " ")
                .replaceAll("admin ", "")
                .replaceAll("_", " ");
            const splitted = formattedPathname.split("");
            const first = splitted[0].toUpperCase();

            const rest = [...splitted];

            rest.splice(0, 1);

            const uppercasePathname = [first, ...rest].join("");
            setPathname(uppercasePathname);
        }
    }, [location.pathname]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            {/* BEGIN: Top Bar */}
            <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
                {/* BEGIN: Notifications */}
                <Popover className="mr-auto intro-x sm:mr-6 ml-auto">
                    {/* <Popover.Button
                        className="
              relative text-slate-600 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
                    >
                        <Lucide
                            icon="Bell"
                            className="w-5 h-5 dark:text-slate-500"
                        />
                    </Popover.Button>
                    <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
                        <div className="mb-5 font-medium">Notifications</div>
                        {_.take(fakerData, 5).map((faker, fakerKey) => (
                            <div
                                key={fakerKey}
                                className={clsx([
                                    "cursor-pointer relative flex items-center",
                                    { "mt-5": fakerKey },
                                ])}
                            >
                                <div className="relative flex-none w-12 h-12 mr-1 image-fit">
                                    <img
                                        alt="Midone Tailwind HTML Admin Template"
                                        className="rounded-full"
                                        src={faker.photos[0]}
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                                </div>
                                <div className="ml-2 overflow-hidden">
                                    <div className="flex items-center">
                                        <a
                                            href=""
                                            className="mr-5 font-medium truncate"
                                        >
                                            {faker.users[0].name}
                                        </a>
                                        <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                                            {faker.times[0]}
                                        </div>
                                    </div>
                                    <div className="w-full truncate text-slate-500 mt-0.5">
                                        {faker.news[0].shortContent}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Popover.Panel> */}
                </Popover>
                {/* END: Notifications  */}
                {/* BEGIN: Account Menu */}
                <Menu>
                    <Menu.Button className="flex items-center justify-center transition bg-slate-300 w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
                        <Lucide icon="User" />
                    </Menu.Button>
                    <Menu.Items className="w-56 mt-px text-white bg-primary">
                        <Menu.Header className="font-normal">
                            <div className="font-medium">
                                {authorizedUser?.fullname}
                            </div>
                            <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                                Баланс: {authorizedUser?.balance}
                            </div>
                        </Menu.Header>
                        <Menu.Divider className="bg-white/[0.08]" />
                        <Menu.Item className="hover:bg-white/5">
                            <Link
                                to={
                                    (authorizedUser?.is_admin ? "/admin" : "") +
                                    `/profile`
                                }
                                className="flex items-center w-full"
                            >
                                <Lucide icon="User" className="w-4 h-4 mr-2" />{" "}
                                Профиль
                            </Link>
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
                                icon="ToggleRight"
                                className="w-4 h-4 mr-2"
                            />{" "}
                            Выйти
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            {/* END: Top Bar */}
        </>
    );
}

export default Main;
