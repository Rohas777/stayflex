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

function Main() {
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

    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const deleteButtonRef = useRef(null);

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
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            // setButtonModalPreview(true);
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
                        className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box flex flex-col h-full">
                            <div className="p-5 flex-auto">
                                <h2 className="block text-base font-medium">
                                    {mail.name}
                                </h2>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        {mail.subject}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                                <Button
                                    variant="primary"
                                    className="flex items-center mr-auto"
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
                                >
                                    <Lucide icon="Pencil" className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex items-center"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setDeleteConfirmationModal(true);
                                    }}
                                >
                                    <Lucide icon="Trash2" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Main;
