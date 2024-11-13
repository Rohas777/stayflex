import _ from "lodash";
import { useState, useRef } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Icon from "@/components/Custom/Icon";
import OnDevMark from "@/components/Custom/OnDevMark";
import MailForm from "./form";
import MailPreview from "./preview";
import clsx from "clsx";

function Main() {
    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [isPreviewOpened, setIsPreviewOpened] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
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

    const mails = [
        {
            id: 1,
            name: "Приветственное письмо",
            subject: "Добро пожаловать в Stayflex",
            body: "",
        },
        {
            id: 2,
            name: "Аккаунт активирован",
            subject: "Ваш аккаунт был активирован",
            body: "",
        },
        {
            id: 3,
            name: "Двухфакторная аутентификация",
            subject: "Двухфакторная аутентификация",
            body: "",
        },
        {
            id: 4,
            name: "Сброс пароля",
            subject: "Ваш пароль был сброшен",
            body: "",
        },
        {
            id: 5,
            name: "Низкий баланс",
            subject: "Ваш баланс близок к нулю",
            body: "",
        },
        {
            id: 6,
            name: "Объект забронирован",
            subject: `Объект "У моря" забронирован`,
            body: "",
        },
    ];

    const onCreate = (mailData: any) => {
        console.log(mailData);
    };

    return (
        <>
            <OnDevMark />
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Шаблоны писем</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={(event) => {
                            event.preventDefault();
                            setIsCreate(true);
                            setIsFormOpened(true);
                        }}
                    >
                        <Icon icon="ListPlus" className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {mails.map((mail) => (
                    <div
                        key={mail.id}
                        className="relative col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box flex flex-col h-full">
                            <div className="p-5 flex-auto z-10">
                                <h2 className="block text-base font-medium">
                                    {mail.name}
                                </h2>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        {mail.subject}
                                    </div>
                                </div>
                            </div>
                            <div className="z-10 flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                                <Button
                                    variant="primary"
                                    className="flex items-center mr-auto"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setIsPreviewOpened(true);
                                    }}
                                >
                                    <Lucide
                                        icon="Eye"
                                        className="w-4 h-4 mr-2"
                                    />
                                    Просмотр
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex items-center mr-2"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setIsCreate(false);
                                        setIsFormOpened(true);
                                    }}
                                >
                                    <Lucide icon="Pencil" className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex items-center"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setConfirmModalContent({
                                            title: "Удалить шаблон?",
                                            description: `Вы уверены, что хотите удалить шаблон "${
                                                "Приветственное письмо" /**FIXME */
                                            }"?`,
                                            onConfirm: () => {},
                                            confirmLabel: "Удалить",
                                            cancelLabel: "Отмена",
                                            is_danger: true,
                                        });
                                        setConfirmationModal(true);
                                    }}
                                >
                                    <Lucide icon="Trash2" className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="absolute top-0 right-0 size-full opacity-5">
                                <Icon
                                    icon="Mail"
                                    className="size-full text-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* BEGIN: Modal Content */}
            <Dialog
                open={isFormOpened}
                size="xl"
                onClose={() => {
                    setIsFormOpened(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsFormOpened(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <MailForm
                        onCreate={onCreate}
                        isCreate={isCreate}
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
            {/* BEGIN: Preview Content */}
            <Dialog
                open={isPreviewOpened}
                size="xl"
                onClose={() => {
                    setIsPreviewOpened(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsPreviewOpened(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <MailPreview />
                </Dialog.Panel>
            </Dialog>
            {/* END: Preview Content */}
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
        </>
    );
}

export default Main;
