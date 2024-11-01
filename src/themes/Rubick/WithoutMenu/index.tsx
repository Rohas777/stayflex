import "@/assets/css/themes/rubick/side-nav.css";
import { Outlet } from "react-router-dom";
import logoUrl from "@/assets/images/logo.svg";
import clsx from "clsx";

function Main() {
    return (
        <div
            className={clsx([
                "rubick px-0 sm:px-8 py-5",
                "before:content-[''] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 dark:before:from-darkmode-800 dark:before:to-darkmode-800 before:fixed before:inset-0 before:z-[-1]",
            ])}
        >
            <img alt="Stayflex" className="w-32 mx-auto mb-5" src={logoUrl} />
            <div className="flex">
                {/* BEGIN: Content */}
                <div className="md:max-w-auto min-h-screen min-w-0 max-w-full flex-1 rounded-[30px] bg-slate-100 px-4 pb-10 before:block before:h-px before:w-full before:content-[''] dark:bg-darkmode-700 md:px-[22px] overflow-hidden sm:overflow-auto">
                    <Outlet />
                </div>
                {/* END: Content */}
            </div>
        </div>
    );
}

export default Main;
