import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Icon from "@/components/Custom/Icon";
import MailForm from "./form";
import MailPreview from "./preview";
import clsx from "clsx";
import SendMailForm from "../../../components/Custom/SendMailForm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    fetchMails,
    sendMail,
    updateMail,
} from "@/stores/reducers/mails/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import { IMail } from "@/stores/models/IMail";
import { SendMail, UpdateMail } from "@/stores/reducers/mails/types";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { stopLoader } from "@/utils/customUtils";
import { mailSlice } from "@/stores/reducers/mails/slice";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";

function Main() {
    const dispatch = useAppDispatch();

    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [isSendFormOpened, setIsSendFormOpened] = useState(false);
    const [isPreviewOpened, setIsPreviewOpened] = useState(false);
    const [formattedMails, setFormattedMails] = useState<IMail[]>([]); //FIXME -
    const [currentMail, setCurrentMail] = useState<IMail | null>(null);

    const { mails, status, error, statusActions, isSended, isUpdated } =
        useAppSelector((state) => state.mail);
    const { setErrorToast } = errorToastSlice.actions;
    const { resetStatus, resetIsSended, resetIsUpdated } = mailSlice.actions;

    const onUpdate = async (mailData: UpdateMail) => {
        await dispatch(updateMail(mailData));
    };
    const onSend = async (mailData: SendMail) => {
        await dispatch(sendMail(mailData));
    };

    useEffect(() => {
        if (statusActions === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpened);

            dispatch(resetStatus());
        }
    }, [statusActions, error]);

    useEffect(() => {
        if (isUpdated || isSended) {
            dispatch(fetchMails());
            setIsFormOpened(false);
            setIsSendFormOpened(false);
            setCurrentMail(null);

            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");

            successEl.querySelector(".text-content")!.textContent = isUpdated
                ? "Шаблон обновлен"
                : "Письмо отправлено";
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();

            dispatch(resetIsUpdated());
            dispatch(resetIsSended());
            stopLoader(setIsLoaderOpened);
        }
    }, [isSended, isUpdated]);

    useEffect(() => {
        dispatch(fetchMails());
    }, []);

    //FIXME ------------------------------------
    useEffect(() => {
        if (!mails || !mails.length || status !== Status.SUCCESS) return;

        setFormattedMails(
            mails.map((mail) => {
                if (mail.slug !== "authorization") return mail;
                return {
                    ...mail,
                    constructions: ["(?code)"],
                };
            })
        );
    }, [mails, status]);
    //FIXME ------------------------------------

    if (status === Status.LOADING) return <Loader />;

    return (
        <>
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
                        <Icon icon="Send" className="size-5 mr-2" />
                        Отправить
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {formattedMails.map((template) => (
                    <div
                        key={template.slug}
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
                                        setCurrentMail(template);
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
                                        setCurrentMail(template);
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
                    setCurrentMail(null);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsFormOpened(false);
                            setCurrentMail(null);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <MailForm
                        onUpdate={onUpdate}
                        currentMail={currentMail}
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
                    <MailPreview currentMail={currentMail} />
                </Dialog.Panel>
            </Dialog>
            {/* END: Preview Content */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content"></div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
