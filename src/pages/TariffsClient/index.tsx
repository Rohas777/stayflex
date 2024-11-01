import _ from "lodash";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    fetchTariffs,
    tariffActivate,
} from "@/stores/reducers/tariffs/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ITariff } from "@/stores/models/ITariff";
import * as lucideIcons from "lucide-react";
import { tariffSlice } from "@/stores/reducers/tariffs/slice";
import { errorToastSlice } from "@/stores/errorToastSlice";
import Loader from "@/components/Custom/Loader/Loader";
import clsx from "clsx";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { Dialog } from "@/components/Base/Headless";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import { fetchAuthorizedUser } from "@/stores/reducers/users/actions";
import { userSlice } from "@/stores/reducers/users/slice";

type IconType = keyof typeof lucideIcons.icons;
function Main() {
    const [confirmationModalPreview, setConfirmationModalPreview] =
        useState(false);
    const [confirmModalContent, setConfirmModalContent] = useState<{
        title: string | null;
        description: string | null;
        onConfirm: (() => void) | null;
        confirmLabel: string | null;
        cancelLabel: string | null;
        is_danger: boolean;
    }>({
        title: null,
        description: null,
        onConfirm: null,
        confirmLabel: null,
        cancelLabel: null,
        is_danger: true,
    });
    const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const icons = lucideIcons.icons;
    const navigate = useNavigate();

    const location = useLocation();
    const { tariffs, statusAll, error, statusByID, isActivated } =
        useAppSelector((state) => state.tariff);
    const { authorizedUser, authorizedUserStatus } = useAppSelector(
        (state) => state.user
    );
    const { updateAuthUserData } = userSlice.actions;
    const { resetStatusByID, resetStatus, resetIsActivated } =
        tariffSlice.actions;
    const dispatch = useAppDispatch();
    const { setErrorToast } = errorToastSlice.actions;

    const onActivate = async (id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(tariffActivate(String(id)));
    };

    useEffect(() => {
        if (statusAll === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);
            dispatch(resetStatus());
        }
        if (statusByID === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);
            dispatch(resetStatusByID());
        }
    }, [statusAll, error, statusByID]);

    useEffect(() => {
        if (isActivated) {
            dispatch(fetchTariffs());
            dispatch(
                updateAuthUserData({
                    ...authorizedUser!,
                    tariff: tariffs.find(
                        (tariff) => tariff.id === selectedTariff
                    )!,
                })
            );
            setConfirmationModalPreview(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent =
                "Тариф успешно активирован";
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
            dispatch(resetIsActivated());
            stopLoader(setIsLoaderOpen);
        }
    }, [isActivated, statusAll]);

    const chunkTariffs = (array: ITariff[], size: number) =>
        Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
            array.slice(index * size, index * size + size)
        );
    useEffect(() => {
        dispatch(fetchTariffs());
    }, []);
    useEffect(() => {
        if (authorizedUserStatus !== Status.SUCCESS || !authorizedUser) return;
        setSelectedTariff(authorizedUser.tariff.id);
    }, [authorizedUser, authorizedUserStatus]);

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
                                Объектов до: {tariff.object_count}
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
                                    onClick={() => {
                                        setConfirmModalContent({
                                            title: "Сменить тариф?",
                                            description: `Вы уверены, что хотите сменить тариф "${authorizedUser?.tariff.name?.trim()}" на тариф "${tariff.name.trim()}"?`,
                                            onConfirm: () => {
                                                onActivate(tariff.id);
                                                setSelectedTariff(tariff.id);
                                            },
                                            confirmLabel: "Сменить",
                                            cancelLabel: "Отмена",
                                            is_danger: false,
                                        });
                                        setConfirmationModalPreview(true);
                                    }}
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
            {/* BEGIN: Confirmation Modal */}
            <Dialog
                open={confirmationModalPreview}
                onClose={() => {
                    setConfirmationModalPreview(false);
                }}
            >
                <Dialog.Panel>
                    {isLoaderOpen && <OverlayLoader />}
                    <div className="p-5 text-center">
                        <Lucide
                            icon={
                                confirmModalContent.is_danger
                                    ? "XCircle"
                                    : "BadgeInfo"
                            }
                            className={clsx("w-16 h-16 mx-auto mt-3", {
                                "text-danger": confirmModalContent.is_danger,
                                "text-warning": !confirmModalContent.is_danger,
                            })}
                        />
                        <div className="mt-5 text-3xl">
                            {confirmModalContent.title}
                        </div>
                        <div
                            className="mt-2 text-slate-500"
                            dangerouslySetInnerHTML={{
                                __html: confirmModalContent.description
                                    ? confirmModalContent.description
                                    : "",
                            }}
                        ></div>
                    </div>
                    <div className="px-5 pb-8 grid grid-cols-12">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setConfirmationModalPreview(false);
                            }}
                            disabled={isLoaderOpen}
                            className="col-span-6 mr-1"
                        >
                            {confirmModalContent.cancelLabel}
                        </Button>
                        <Button
                            variant={
                                confirmModalContent.is_danger
                                    ? "danger"
                                    : "warning"
                            }
                            disabled={isLoaderOpen}
                            type="button"
                            className="col-span-6"
                            onClick={() => {
                                confirmModalContent.onConfirm &&
                                    confirmModalContent.onConfirm();
                            }}
                        >
                            {confirmModalContent.confirmLabel}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Confirmation Modal */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content">
                        Пользователь успешно добавлен
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
