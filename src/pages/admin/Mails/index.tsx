import _ from "lodash";
import { useState, useRef, useEffect } from "react";
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
import SendMailForm from "../../../components/Custom/SendMailForm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchMails } from "@/stores/reducers/mails/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import { IMail } from "@/stores/models/IMail";

function Main() {
    const dispatch = useAppDispatch();

    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [isSendFormOpened, setIsSendFormOpened] = useState(false);
    const [isPreviewOpened, setIsPreviewOpened] = useState(false);
    const [formattedMails, setFormattedMails] = useState<IMail[]>([]);

    const { mails, status, error } = useAppSelector((state) => state.mail);

    const tempMails = [
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
            name: "Объект забронирован",
            subject: `Объект "У моря" забронирован`,
            body: "",
        },
    ];

    const onUpdate = (mailData: any) => {
        console.log("Update data: ", mailData);
    };
    const onSend = (mailData: any) => {
        console.log("Send data: ", mailData);
    };

    useEffect(() => {
        dispatch(fetchMails());
    }, []);

    useEffect(() => {
        const dataArray = Object.entries(mails).map(([key, value]) => ({
            name: key,
            subject: value.subject,
            body: value.body,
        }));
        setFormattedMails(dataArray);
    }, [mails]);

    if (status === Status.LOADING) return <Loader />;

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
                            setIsSendFormOpened(true);
                        }}
                    >
                        <Icon icon="ListPlus" className="size-5 mr-2" />
                        Отправить
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {tempMails.map((template) => (
                    <div
                        key={template.name}
                        className="relative col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box flex flex-col h-full">
                            <div className="p-5 flex-auto z-10">
                                <h2 className="block text-base font-medium">
                                    {template.name}
                                </h2>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        {template.subject}
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
                                    className="flex items-center"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setIsFormOpened(true);
                                    }}
                                >
                                    <Lucide icon="Pencil" className="w-4 h-4" />
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
            {/* BEGIN: Update Form Content */}
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
                        onUpdate={onUpdate}
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Update Form Content */}
            {/* BEGIN: Send Form Content */}
            <Dialog
                open={isSendFormOpened}
                size="xl"
                onClose={() => {
                    setIsSendFormOpened(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsSendFormOpened(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <SendMailForm
                        onSend={onSend}
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Send Form Content */}
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
        </>
    );
}

export default Main;
