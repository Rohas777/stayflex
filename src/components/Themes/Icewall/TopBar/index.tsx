import { useState, Fragment } from "react";
import Lucide from "@/components/Base/Lucide";
import logoUrl from "@/assets/images/logo.svg";
import { Link } from "react-router-dom";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { FormInput } from "@/components/Base/Form";
import { Menu, Popover } from "@/components/Base/Headless";
import fakerData from "@/utils/faker";
import _ from "lodash";
import clsx from "clsx";
import { Transition } from "@headlessui/react";

function Main() {
    const [searchDropdown, setSearchDropdown] = useState(false);
    const showSearchDropdown = () => {
        setSearchDropdown(true);
    };
    const hideSearchDropdown = () => {
        setSearchDropdown(false);
    };

    return (
        <>
            {/* BEGIN: Top Bar */}
            <div className="top-bar-boxed relative z-[51] -mx-5 mb-12 mt-12 h-[70px] border-b border-white/[0.08] px-3 sm:-mx-8 sm:px-8 md:-mt-5 md:pt-0">
                <div className="flex items-center h-full">
                    {/* BEGIN: Logo */}
                    <Link to="/" className="hidden -intro-x md:flex mr-auto">
                        <img alt="Stayflex" className="w-32" src={logoUrl} />
                    </Link>
                    {/* END: Logo */}
                    {/* BEGIN: Notifications */}
                    <Popover className="mr-4 intro-x sm:mr-6">
                        <Popover.Button
                            className="
              relative text-white/70 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
                        >
                            <Lucide
                                icon="Bell"
                                className="w-5 h-5 dark:text-slate-500"
                            />
                        </Popover.Button>
                        <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
                            <div className="mb-5 font-medium">
                                Notifications
                            </div>
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
                        </Popover.Panel>
                    </Popover>
                    {/* END: Notifications */}
                    {/* BEGIN: Account Menu */}
                    <Menu>
                        <Menu.Button className="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x">
                            <img
                                alt="Midone Tailwind HTML Admin Template"
                                src={fakerData[9].photos[0]}
                            />
                        </Menu.Button>
                        <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                            <Menu.Header className="font-normal">
                                <div className="font-medium">
                                    {fakerData[0].users[0].name}
                                </div>
                                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                                    {fakerData[0].jobs[0]}
                                </div>
                            </Menu.Header>
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide icon="User" className="w-4 h-4 mr-2" />{" "}
                                Profile
                            </Menu.Item>
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide
                                    icon="FilePenLine"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Add Account
                            </Menu.Item>
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                                Reset Password
                            </Menu.Item>
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide
                                    icon="HelpCircle"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Help
                            </Menu.Item>
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide
                                    icon="ToggleRight"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Logout
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                    {/* END: Account Menu */}
                </div>
            </div>
            {/* END: Top Bar */}
        </>
    );
}

export default Main;
