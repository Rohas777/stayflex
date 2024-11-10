import _ from "lodash";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import { FormSwitch } from "@/components/Base/Form";
import Progress from "@/components/Base/Progress";
import Lucide from "@/components/Base/Lucide";
import StackedBarChart1 from "@/components/StackedBarChart1";
import SimpleLineChart from "@/components/SimpleLineChart";
import SimpleLineChart1 from "@/components/SimpleLineChart1";
import SimpleLineChart2 from "@/components/SimpleLineChart2";
import { Menu, Tab } from "@/components/Base/Headless";
import { Tab as HeadlessTab } from "@headlessui/react";
import { useAppSelector } from "@/stores/hooks";

function Main() {
    const { authorizedUser } = useAppSelector((state) => state.user);

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Профиль</h2>
            </div>
            {/* BEGIN: Profile Info */}
            <div className="px-5 pt-5 mt-5 intro-y box">
                <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                    <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
                        <div className="relative flex items-center justify-center bg-slate-200 rounded-full overflow-hidden flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                            <Lucide icon="User" className="size-3/4" />
                        </div>
                        <div className="ml-5">
                            <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                                {authorizedUser?.fullname}
                            </div>
                            <div className="text-slate-500">
                                Баланс: {authorizedUser?.balance}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
                        <div className="font-medium text-center lg:text-left lg:mt-3">
                            Пользовательские данные
                        </div>
                        <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                            <div className="flex items-center truncate sm:whitespace-normal">
                                <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                                {authorizedUser?.mail}
                            </div>
                            <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                                <Lucide icon="Phone" className="w-4 h-4 mr-2" />{" "}
                                {authorizedUser?.phone}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
                        <div className="font-medium text-center lg:text-left lg:mt-3">
                            О тарифе
                        </div>
                        <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                            <div className="flex items-center truncate sm:whitespace-normal">
                                <Lucide
                                    icon="CreditCard"
                                    className="w-4 h-4 mr-2"
                                />
                                Тариф: {authorizedUser?.tariff?.name}
                            </div>
                            <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                                {authorizedUser?.date_before && (
                                    <>
                                        <Lucide
                                            icon="Calendar"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Активен до:{" "}
                                        {new Date(
                                            authorizedUser?.date_before
                                        ).toLocaleDateString()}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* END: Profile Info */}
        </>
    );
}

export default Main;
