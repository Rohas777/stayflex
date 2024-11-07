import Button from "@/components/Base/Button";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import Server from "./server";
import { useEffect, useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import { ListPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    createServer,
    deleteServer,
    fetchServers,
    serverSetDefault,
    updateServer,
} from "@/stores/reducers/servers/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import ServerForm from "./form";
import { Dialog } from "@/components/Base/Headless";
import {
    ServerCreateType,
    ServerUpdateType,
} from "@/stores/reducers/servers/types";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { serverSlice } from "@/stores/reducers/servers/slice";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Toastify from "toastify-js";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import clsx from "clsx";

interface IConfiramtionModal {
    title: string | null;
    description: string | null;
    onConfirm: (() => void) | null;
    confirmLabel: string | null;
    cancelLabel: string | null;
    is_danger: boolean;
}
type CustomErrors = {
    isValid: boolean;
    server: string | null;
};

function Main() {
    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [select, setSelect] = useState("-1");
    const [openForm, setOpenForm] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [confirmModalContent, setConfirmModalContent] =
        useState<IConfiramtionModal>({
            title: null,
            description: null,
            onConfirm: null,
            confirmLabel: null,
            cancelLabel: null,
            is_danger: true,
        });
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        server: null,
    });

    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            server: null,
        };
        if (select === "-1" || !servers.find((s) => s.id === Number(select))) {
            errors.server = "Обязательно выберите объект";
        }
        Object.keys(errors).forEach((key) => {
            if (errors[key as keyof CustomErrors] && key != "isValid") {
                errors.isValid = false;
                return;
            }
        });
        setCustomErrors(errors);
        return errors;
    };

    const {
        servers,
        status,
        statusAction,
        error,
        isCreated,
        isSetDefault,
        isDeleted,
        isUpdated,
    } = useAppSelector((state) => state.server);
    const {
        resetIsCreated,
        resetIsSetDefault,
        resetStatus,
        resetIsDeleted,
        resetIsUpdated,
    } = serverSlice.actions;
    const dispatch = useAppDispatch();
    const { setErrorToast } = errorToastSlice.actions;

    const onSetDefault = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();
        startLoader(setIsLoaderOpened);
        const res = await vaildateWithoutYup();
        if (!res.isValid) {
            stopLoader(setIsLoaderOpened);
            return;
        }
        stopLoader(setIsLoaderOpened);

        setConfirmModalContent({
            title: "Сменить сервер по умолчанию?",
            description: "Вы уверены что хотите сменить сервер по умолчанию?",
            onConfirm: () => {
                onChangeDefault(Number(select));
            },
            confirmLabel: "Сменить",
            cancelLabel: "Отмена",
            is_danger: false,
        });
        setConfirmationModal(true);
    };

    const onCreate = async (data: ServerCreateType) => {
        await dispatch(createServer(data));
    };
    const onDelete = async (id: number) => {
        await dispatch(deleteServer(String(id)));
    };
    const onUpdate = async (data: ServerUpdateType) => {
        await dispatch(updateServer(data));
    };
    const onChangeDefault = async (id: number) => {
        await dispatch(serverSetDefault(String(id)));
    };

    useEffect(() => {
        if (status === Status.ERROR) {
            dispatch(setErrorToast({ message: error!, isError: true }));
            dispatch(resetStatus());
            stopLoader(setIsLoaderOpened);
        }
        if (statusAction === Status.ERROR) {
            dispatch(setErrorToast({ message: error!, isError: true }));
            dispatch(resetStatus());
            stopLoader(setIsLoaderOpened);
        }
    }, [status, statusAction]);

    useEffect(() => {
        if (isCreated || isDeleted || isSetDefault || isUpdated) {
            dispatch(fetchServers());
            setOpenForm(false);
            setConfirmationModal(false);

            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");

            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Сервер успешно создан"
                : isDeleted
                ? "Сервер успешно удален"
                : isSetDefault
                ? "Сервер успешно установлен по умолчанию"
                : "Сервер успешно обновлен";
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();

            dispatch(resetIsCreated());
            dispatch(resetIsDeleted());
            dispatch(resetIsSetDefault());
            dispatch(resetIsUpdated());
            stopLoader(setIsLoaderOpened);
        }
    }, [isCreated, isDeleted, isSetDefault, isUpdated]);

    useEffect(() => {
        dispatch(fetchServers());
    }, []);

    useEffect(() => {
        if (status !== Status.SUCCESS) return;
        const defaultServer = servers.find((server) => server.is_default);
        setSelect(defaultServer ? String(defaultServer.id) : "-1");
    }, [status]);

    if (status === Status.LOADING) return <Loader />;

    return (
        <div className="pb-16">
            {isLoaderOpened && <OverlayLoader />}
            <div className="flex flex-wrap items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Серверы</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={() => setOpenForm(true)}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            {!!servers.length ? (
                <div className="mt-5 intro-y box p-5">
                    {servers.map((server) => (
                        <Server
                            key={server.id}
                            id={server.id}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            isLoaderOpened={isLoaderOpened}
                            setIsLoaderOpened={setIsLoaderOpened}
                            setConfirmationModalContent={setConfirmModalContent}
                            setConfirmationModal={setConfirmationModal}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center mt-5 intro-y box p-5">
                    <Lucide
                        icon="AlertTriangle"
                        className="size-20 text-danger"
                    />
                    <div className="font-medium text-2xl mt-3">
                        Серверов нет
                    </div>
                    <Button
                        variant="primary"
                        className="mt-3 shadow-md"
                        onClick={() => setOpenForm(true)}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить первый
                    </Button>
                </div>
            )}

            {!!servers.length && (
                <>
                    <div className="flex items-center mt-8 intro-y">
                        <h2 className="mr-auto text-lg font-medium">
                            Сервер по умолчанию
                        </h2>
                    </div>
                    <div className="mt-5 intro-y box p-5">
                        {/* BEGIN: Basic Select */}
                        <div className="grid grid-cols-12 gap-3 sm:gap-5">
                            <div className="col-span-12 sm:col-span-7">
                                <TomSelect
                                    value={select}
                                    onChange={(e) => {
                                        setSelect(e.target.value);
                                        setCustomErrors({
                                            ...customErrors,
                                            server: null,
                                        });
                                    }}
                                    options={{
                                        controlInput: undefined,
                                        searchField: undefined,
                                    }}
                                    className={clsx(
                                        "w-full",
                                        customErrors.server && "border-danger"
                                    )}
                                >
                                    {servers.map((server) => (
                                        <option value={server.id}>
                                            {server.name}
                                        </option>
                                    ))}
                                </TomSelect>
                            </div>
                            <Button
                                variant="primary"
                                className="col-span-12 sm:col-span-5 flex items-center justify-center shadow-md"
                                onClick={onSetDefault}
                            >
                                <Lucide
                                    icon="Save"
                                    className="size-5 mr-2 flex-shrink-0"
                                />
                                Сохранить
                            </Button>
                        </div>
                        {customErrors.server && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.server === "string" &&
                                    customErrors.server}
                            </div>
                        )}
                        {/* END: Basic Select */}
                    </div>
                </>
            )}
            {/* BEGIN: Modal Content */}
            <Dialog
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenForm(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ServerForm
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
                        onCreate={onCreate}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
            {/* BEGIN: Confirmation Modal */}
            <Dialog
                open={confirmationModal}
                onClose={() => {
                    setConfirmationModal(false);
                }}
            >
                <Dialog.Panel>
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
                                setConfirmationModal(false);
                            }}
                            disabled={isLoaderOpened}
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
                            disabled={isLoaderOpened}
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
                        Сервер успешно добавлен
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </div>
    );
}

export default Main;
