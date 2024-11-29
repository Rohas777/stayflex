import _ from "lodash";
import Lucide from "@/components/Base/Lucide";
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
                    <div className="flex justify-center flex-1 px-5 lg:mt-3 lg:justify-start">
                        <div className="lg:ml-5">
                            <div className="text-lg font-medium sm:whitespace-normal">
                                {authorizedUser?.fullname}
                            </div>
                            {!authorizedUser?.is_admin && (
                                <div className="text-slate-500 text-center lg:text-left">
                                    Баланс: {authorizedUser?.balance}
                                </div>
                            )}
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
