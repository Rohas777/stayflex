import _ from "lodash";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { createTariff, fetchTariffs } from "@/stores/reducers/tariffs/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ITariff } from "@/stores/models/ITariff";
import { Dialog } from "@/components/Base/Headless";
import TariffForm from "./form";
import { TariffCreateType } from "@/stores/reducers/tariffs/types";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import * as lucideIcons from "lucide-react";

type IconType = keyof typeof lucideIcons.icons;
function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isCreatePopup, setIsCreatePopup] = useState(true);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [tariffId, setTariffId] = useState<number | null>(null);
    const [iconsToChoose, setIconsToChoose] = useState<IconType[]>([]);

    const mountedRef = useRef(false);

    const { tariffs, status, error } = useAppSelector((state) => state.tariff);
    const dispatch = useAppDispatch();

    const onCreate = async (tariffData: TariffCreateType) => {
        await dispatch(createTariff(tariffData));
        await dispatch(fetchTariffs());
        await setButtonModalPreview(false);

        const successEl = document
            .querySelectorAll("#success-notification-content")[0]
            .cloneNode(true) as HTMLElement;
        successEl.classList.remove("hidden");
        await Toastify({
            node: successEl,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }).showToast();
    };
    const onUpdate = (tariff: TariffCreateType) => {
        // dispatch(createPropertyType(tariff));
        // dispatch(fetchPropertyTypes());
        // setButtonModalPreview(false);
    };

    const { icons } = lucideIcons;
    const chunkTariffs = (array: ITariff[], size: number) =>
        Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
            array.slice(index * size, index * size + size)
        );
    useEffect(() => {
        dispatch(fetchTariffs());

        if (!mountedRef.current) {
            setIconsToChoose(Object.keys(icons) as IconType[]);
        } else {
            mountedRef.current = true;
        }
    }, []);

    if (status === Status.LOADING && !isLoaderOpen) {
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
            <div className="flex items-center mt-8 intro-y">
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
                            <Lucide
                                icon="CreditCard"
                                className="block w-12 h-12 mx-auto text-primary"
                            />
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
            <div className="flex flex-col mt-5 intro-y box lg:flex-row">
                <div className="flex-1 px-5 py-16 intro-y">
                    <Lucide
                        icon="CreditCard"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Basic Plan
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            35
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
                <div className="flex-1 p-5 py-16 border-t border-b intro-y lg:border-b-0 lg:border-t-0 lg:border-l lg:border-r border-slate-200/60 dark:border-darkmode-400">
                    <Lucide
                        icon="Briefcase"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Business
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            60
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
                <div className="flex-1 px-5 py-16 intro-y">
                    <Lucide
                        icon="ShoppingBag"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Enterprise
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            120
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
            </div>
            {/* END: Pricing Layout */}
            {/* BEGIN: Pricing Layout */}
            <div className="flex flex-col mt-5 intro-y box lg:flex-row">
                <div className="flex-1 px-5 py-16 intro-y">
                    <Lucide
                        icon="Activity"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Basic Plan
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            35
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
                <div className="flex-1 px-5 py-16 border-t border-b intro-y lg:border-b-0 lg:border-t-0 lg:border-l lg:border-r border-slate-200/60 dark:border-darkmode-400">
                    <Lucide
                        icon="Box"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Business
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            60
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
                <div className="flex-1 px-5 py-16 intro-y">
                    <Lucide
                        icon="Send"
                        className="block w-12 h-12 mx-auto text-primary"
                    />
                    <div className="mt-10 text-xl font-medium text-center">
                        Enterprise
                    </div>
                    <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
                        1 Domain <span className="mx-1">•</span> 10 Users{" "}
                        <span className="mx-1">•</span> 20 Copies
                    </div>
                    <div className="px-10 mx-auto mt-2 text-center text-slate-500">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                    </div>
                    <div className="flex justify-center">
                        <div className="relative mx-auto mt-8 text-5xl font-semibold">
                            <span className="absolute top-0 left-0 -ml-4 text-2xl">
                                $
                            </span>{" "}
                            120
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        rounded
                        type="button"
                        className="block px-4 py-3 mx-auto mt-8"
                    >
                        PURCHASE NOW
                    </Button>
                </div>
            </div>
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
                        currentTariffId={tariffId!}
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                        icons={iconsToChoose}
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
                    <div className="font-medium">Тариф успешно добавлено</div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
