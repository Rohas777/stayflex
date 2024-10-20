import _, { update } from "lodash";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    createTariff,
    fetchTariffById,
    fetchTariffs,
    updateTariff,
} from "@/stores/reducers/tariffs/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ITariff } from "@/stores/models/ITariff";
import { Dialog } from "@/components/Base/Headless";
import TariffForm from "./form";
import {
    TariffCreateType,
    TariffUpdateType,
} from "@/stores/reducers/tariffs/types";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import { stopLoader } from "@/utils/customUtils";
import { tariffSlice } from "@/stores/reducers/tariffs/slice";
import { IconType } from "@/vars";
import * as lucideIcons from "lucide-react";

function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isCreatePopup, setIsCreatePopup] = useState(true);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [tariffId, setTariffId] = useState<number | null>(null);

    const icons = lucideIcons.icons;

    const { tariffs, statusAll, isCreated, statusByID, error } = useAppSelector(
        (state) => state.tariff
    );
    const { resetIsCreated } = tariffSlice.actions;
    const dispatch = useAppDispatch();

    const onCreate = async (tariffData: TariffCreateType) => {
        await dispatch(createTariff(tariffData));
    };
    const onUpdate = async (tariffData: TariffUpdateType) => {
        await dispatch(updateTariff(tariffData));
    };
    useEffect(() => {
        if (statusByID === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            console.log(error);
        }
        if (isCreated) {
            dispatch(fetchTariffs());
            setButtonModalPreview(false);
            const successEl = document
                .querySelectorAll(
                    isCreatePopup
                        ? "#success-notification-content"
                        : "#success-update-notification-content"
                )[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
            stopLoader(setIsLoaderOpen);
            dispatch(resetIsCreated());
        }
    }, [isCreated, statusByID]);

    const chunkTariffs = (array: ITariff[], size: number) =>
        Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
            array.slice(index * size, index * size + size)
        );
    useEffect(() => {
        dispatch(fetchTariffs());
    }, []);

    if (statusAll === Status.LOADING && !isLoaderOpen) {
        return (
            <>
                <div className="w-full h-screen relative">
                    <div className="absolute inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex flex-wrap items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Тарифы</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsCreatePopup(true);
                            setButtonModalPreview(true);
                        }}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            {/* BEGIN: Pricing Layout */}
            {chunkTariffs(tariffs, 3).map((tariffsChunk, index) => (
                <div
                    key={index}
                    className="flex flex-col mt-5 intro-y box lg:flex-row"
                >
                    {tariffsChunk.map((tariff) => (
                        <div
                            key={tariff.id}
                            className="flex-1 px-5 py-16 intro-y"
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
                            <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                                {tariff.description}
                            </div>
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
                            <Button
                                variant="primary"
                                rounded
                                type="button"
                                className="flex items-center px-4 py-3 mx-auto mt-8"
                                onClick={() => {
                                    setTariffId(tariff.id);
                                    setIsCreatePopup(false);
                                    setButtonModalPreview(true);
                                    dispatch(fetchTariffById(tariff.id));
                                }}
                            >
                                <Lucide
                                    icon="Pencil"
                                    className="mr-2 size-5 text-white"
                                />
                                РЕДАКТИРОВАТЬ
                            </Button>
                        </div>
                    ))}
                </div>
            ))}
            {/* END: Pricing Layout */}
            {/* BEGIN: Modal Content */}
            <Dialog
                open={buttonModalPreview}
                onClose={() => {
                    setButtonModalPreview(false);
                    setTariffId(isCreatePopup ? null : tariffId);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalPreview(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <TariffForm
                        isCreate={isCreatePopup}
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Тариф успешно добавлен</div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-update-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Тариф успешно обновлён</div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
