import _ from "lodash";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchTariffs } from "@/stores/reducers/tariffs/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ITariff } from "@/stores/models/ITariff";
import * as lucideIcons from "lucide-react";
import { tariffSlice } from "@/stores/reducers/tariffs/slice";
import { errorToastSlice } from "@/stores/errorToastSlice";
import Loader from "@/components/Custom/Loader/Loader";
import clsx from "clsx";

type IconType = keyof typeof lucideIcons.icons;
function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const icons = lucideIcons.icons;

    const location = useLocation();
    const { tariffs, statusAll, error, statusByID } = useAppSelector(
        (state) => state.tariff
    );
    const { authorizedUser, authorizedUserStatus } = useAppSelector(
        (state) => state.user
    );
    const { resetStatusByID, resetStatus } = tariffSlice.actions;
    const dispatch = useAppDispatch();
    const { setErrorToast } = errorToastSlice.actions;
    useEffect(() => {
        if (statusAll === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));

            dispatch(resetStatus());
        }
        if (statusByID === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));

            dispatch(resetStatusByID());
        }
    }, [statusAll, error, statusByID]);
    const chunkTariffs = (array: ITariff[], size: number) =>
        Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
            array.slice(index * size, index * size + size)
        );
    useEffect(() => {
        dispatch(fetchTariffs());
    }, []);

    if (
        (statusAll === Status.LOADING ||
            authorizedUserStatus === Status.LOADING) &&
        !isLoaderOpen
    ) {
        return <Loader />;
    }

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Тарифы</h2>
            </div>
            {/* BEGIN: Pricing Layout */}
            {chunkTariffs(tariffs, 3).map((tariffsChunk) => (
                <div className="flex flex-col mt-5 intro-y box lg:flex-row">
                    {tariffsChunk.map((tariff) => (
                        <div
                            key={tariff.id}
                            className={clsx("flex-1 px-5 py-16 intro-y", {
                                "bg-success bg-opacity-30":
                                    tariff.id === authorizedUser?.tariff.id,
                            })}
                        >
                            {tariff.icon && tariff.icon in icons && (
                                <Lucide
                                    icon={tariff.icon as IconType}
                                    className="block w-12 h-12 mx-auto text-primary"
                                />
                            )}
                            <div className="mt-10 text-xl font-medium text-center">
                                {tariff.name}
                            </div>
                            <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                                Объектов: {tariff.object_count}
                            </div>
                            <div
                                className="px-10 mx-auto mt-2 text-center text-slate-500"
                                dangerouslySetInnerHTML={{
                                    __html: tariff.description.replace(
                                        /\n/g,
                                        "<br/>"
                                    ),
                                }}
                            ></div>
                            <div className="flex justify-center">
                                <div className="relative mx-auto mt-8 text-5xl font-semibold">
                                    {tariff.daily_price}
                                    <span className="absolute top-0 right-0 -mr-5 text-2xl">
                                        ₽
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative mx-auto text-slate-400 text-base">
                                    / в день
                                </div>
                            </div>
                            {authorizedUser?.tariff.id !== tariff.id && (
                                <Button
                                    variant="primary"
                                    rounded
                                    type="button"
                                    className="block px-4 py-3 mx-auto mt-8"
                                >
                                    ВЫБРАТЬ
                                </Button>
                            )}
                            {authorizedUser?.tariff.id === tariff.id && (
                                <Button
                                    variant="success"
                                    rounded
                                    type="button"
                                    className="block px-4 py-3 mx-auto mt-8 cursor-default !focus:ring-0"
                                >
                                    АКТИВЕН
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            {/* END: Pricing Layout */}
        </>
    );
}

export default Main;
