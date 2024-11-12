import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import * as xlsx from "xlsx";
import { useEffect, useRef, createRef, useState } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "@/utils/helper";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { deleteUser, fetchUsers } from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link, useNavigate } from "react-router-dom";
import { clientSlice } from "@/stores/reducers/clients/slice";
import {
    createClient,
    deleteClient,
    fetchClients,
    saveClient,
} from "@/stores/reducers/clients/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import clsx from "clsx";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import Icon from "@/components/Custom/Icon";
import ClientForm from "./form";
import { ClientCreateType } from "@/stores/reducers/clients/types";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    phone?: string;
    email?: string;
    grade?: number;
    reservation_count?: number;
}

function Main() {
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [createModal, setCreateModal] = useState(false);
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

    const { authorizedUser } = useAppSelector((state) => state.user);

    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "name",
        type: "like",
        value: "",
    });

    const [tableData, setTableData] = useState<Response[]>([]);

    const navigate = useNavigate();

    const initTabulator = () => {
        if (tableRef.current) {
            tabulator.current = new Tabulator(tableRef.current, {
                reactiveData: true,
                data: tableData,
                paginationMode: "local",
                filterMode: "local",
                sortMode: "local",
                printAsHtml: true,
                printStyled: true,
                pagination: true,
                paginationSize: 10,
                paginationSizeSelector: [10, 20, 50, 100],
                layout: "fitColumns",
                responsiveLayout: "collapse",
                placeholder: "Записи не найдены",
                columns: [
                    {
                        title: "",
                        field: "id",
                        formatter: "responsiveCollapse",
                        width: 40,
                        minWidth: 30,
                        hozAlign: "center",
                        resizable: false,
                        headerSort: false,
                    },

                    // For HTML table
                    {
                        title: "ID",
                        maxWidth: 100,
                        responsive: 0,
                        field: "id",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.id}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Имя",
                        minWidth: 200,
                        responsive: 0,
                        field: "name",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.name}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Телефон",
                        minWidth: 200,
                        field: "phone",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.phone}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Email",
                        minWidth: 200,
                        field: "email",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.email}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Брони",
                        minWidth: 200,
                        field: "reservation_count",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.reservation_count}</div>
                                    </div>`;
                        },
                    },
                    // {
                    //     title: "Оценка",
                    //     minWidth: 200,
                    //     field: "grade",
                    //     responsive: 1,
                    //     hozAlign: "center",
                    //     headerHozAlign: "center",
                    //     vertAlign: "middle",
                    //     print: false,
                    //     download: false,
                    //     formatter(cell) {
                    //         const response: Response = cell.getData();
                    //         const a = stringToHTML(
                    //             `<div class="min-w-32 flex lg:justify-center items-center"></div>`
                    //         );
                    //         const grades = [0, 1, 2, 3, 4, 5];
                    //         const options = grades.map((grade) => {
                    //             return `<option class="cursor-pointer" ${
                    //                 grade === response.grade ? "selected" : ""
                    //             } value="${grade}">${
                    //                 grade === 0
                    //                     ? "Без оценки"
                    //                     : "★".repeat(grade)
                    //             }</option>`;
                    //         });
                    //         const selector =
                    //             stringToHTML(`<select class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    //                 ${options.join("")}
                    //                     </select>`);

                    //         a.append(selector);
                    //         a.addEventListener("hover", function () {});

                    //         selector.addEventListener(
                    //             "change",
                    //             function (this: HTMLInputElement) {
                    //                 console.log(this.value);
                    //             }
                    //         );
                    //         return a;
                    //     },
                    // },
                    {
                        minWidth: 50,
                        maxWidth: 150,
                        title: "Действия",
                        field: "id",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "right",
                        resizable: false,
                        headerSort: false,
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex h-full justify-end items-center"></div>`
                            );
                            const info =
                                stringToHTML(`<a class="flex items-center w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="info"></i>
                              </a>`);
                            tippy(info, {
                                content: "Подробнее",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            a.append(info);
                            if (response?.reservation_count! < 1) {
                                const deleteA =
                                    stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 ml-3 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                                tippy(deleteA, {
                                    content: "Удалить",
                                    placement: "bottom",
                                    animation: "shift-away",
                                });
                                deleteA.addEventListener("click", function () {
                                    setConfirmModalContent({
                                        title: "Удалить клиента?",
                                        description: `Вы уверены, что хотите удалить клиента "${response.name?.trim()}"?<br/>Это действие нельзя будет отменить.`,
                                        onConfirm: () => {
                                            onDelete(response.id!);
                                        },
                                        confirmLabel: "Удалить",
                                        cancelLabel: "Отмена",
                                        is_danger: true,
                                    });
                                    setConfirmationModalPreview(true);
                                });
                                a.append(deleteA);
                            }
                            a.addEventListener("hover", function () {});
                            info.addEventListener("click", function () {
                                if (authorizedUser?.is_admin) {
                                    navigate(
                                        `/admin/reservations/client/${response.id}`
                                    );
                                } else {
                                    navigate(
                                        `/reservations/client/${response.id}`
                                    );
                                }
                            });
                            return a;
                        },
                    },

                    // For print format
                    {
                        title: "NAME",
                        field: "name",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "PHONE",
                        field: "phone",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "EMAIL",
                        field: "email",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "GRADE",
                        field: "grade",
                        visible: false,
                        print: true,
                        download: true,
                    },
                ],
            });
        }

        tabulator.current?.on("renderComplete", () => {
            createIcons({
                icons,
                attrs: {
                    "stroke-width": 1.5,
                },
                nameAttr: "data-lucide",
            });
        });
    };

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
        window.addEventListener("resize", () => {
            if (tabulator.current) {
                tabulator.current.redraw();
                createIcons({
                    icons,
                    attrs: {
                        "stroke-width": 1.5,
                    },
                    nameAttr: "data-lucide",
                });
            }
        });
    };

    const reInitTabulator = () => {
        if (tabulator.current) {
            tabulator.current.redraw();
            createIcons({
                icons,
                attrs: {
                    "stroke-width": 1.5,
                },
                nameAttr: "data-lucide",
            });
        }
    };

    const onFilter = () => {
        if (tabulator.current) {
            tabulator.current.setFilter([
                [
                    {
                        field: "name",
                        type: "like",
                        value: filter.value,
                    },
                    {
                        field: "id",
                        type: "like",
                        value: filter.value,
                    },
                ],
            ]);
        }
    };
    const onResetFilter = () => {
        setFilter({
            ...filter,
            field: "name",
            type: "like",
            value: "",
        });
        if (tabulator.current) {
            tabulator.current.setFilter("name", "like", "");
        }
    };

    const onExportCsv = () => {
        if (tabulator.current) {
            tabulator.current.download("csv", "data.csv");
        }
    };
    const onExportJson = () => {
        if (tabulator.current) {
            tabulator.current.download("json", "data.json");
        }
    };
    const onExportXlsx = () => {
        if (tabulator.current) {
            (window as any).XLSX = xlsx;
            tabulator.current.download("xlsx", "data.xlsx", {
                sheetName: "Users",
            });
        }
    };
    const onExportHtml = () => {
        if (tabulator.current) {
            tabulator.current.download("html", "data.html", {
                style: true,
            });
        }
    };

    const onDelete = async (id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(deleteClient(String(id)));
    };

    const onCreate = async (clientData: ClientCreateType) => {
        await dispatch(createClient(clientData));
    };
    const onSave = async (client_id: number) => {
        await dispatch(saveClient(client_id));
    };

    const { clients, status, error, isDeleted, isCreated } = useAppSelector(
        (state) => state.client
    );
    const clientActions = clientSlice.actions;
    const dispatch = useAppDispatch();
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
        if (status === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);
            dispatch(clientActions.resetStatus());
        }
    }, [status, error]);

    useEffect(() => {
        if (isDeleted || isCreated) {
            dispatch(fetchClients());
            setConfirmationModalPreview(false);
            setCreateModal(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Пользователь успешно создан"
                : "Пользователь успешно удалён";
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
            dispatch(clientActions.resetIsDeleted());
            dispatch(clientActions.resetIsCreated());
            dispatch(clientActions.resetClientByPhone());
            stopLoader(setIsLoaderOpen);
        }
    }, [isDeleted, isCreated, status]);

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchClients());
    }, []);
    useEffect(() => {
        if (clients.length) {
            const formattedData = clients.map((client) => ({
                id: client.id,
                name: client.fullname,
                phone: client.phone,
                email: client.email,
                grade: client.reiting,
                reservation_count: client.reservation_count,
            }));
            tabulator.current?.setData(formattedData).then(function () {
                reInitTabulator();
            });
        }
    }, [clients]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Клиенты</h2>

                <Button
                    onClick={() => setCreateModal(true)}
                    variant="primary"
                    className="mr-2 shadow-md"
                >
                    <ListPlus className="size-5 mr-2" />
                    Добавить
                </Button>
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && <OverlayLoader />}
                <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
                    <form
                        id="tabulator-html-filter-form"
                        className="xl:flex sm:mr-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFilter();
                        }}
                    >
                        <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="flex whitespace-nowrap flex-none mr-2 xl:w-auto xl:flex-initial">
                                <Lucide icon="Search" className="w-4 h-4" />
                            </label>
                            <FormInput
                                id="tabulator-html-filter-value"
                                value={filter.value}
                                onChange={(e) => {
                                    setFilter({
                                        ...filter,
                                        value: e.target.value,
                                    });
                                }}
                                type="text"
                                className="mt-2 sm:w-40 2xl:w-full sm:mt-0"
                                placeholder="Поиск..."
                            />
                        </div>
                        <div className="mt-2 xl:mt-0">
                            <Button
                                id="tabulator-html-filter-go"
                                variant="primary"
                                type="button"
                                className="w-full sm:w-16"
                                onClick={onFilter}
                            >
                                Начать
                            </Button>
                            <Button
                                id="tabulator-html-filter-reset"
                                variant="secondary"
                                type="button"
                                className="w-full mt-2 sm:w-20 sm:mt-0 sm:ml-1"
                                onClick={onResetFilter}
                            >
                                Сбросить
                            </Button>
                        </div>
                    </form>
                    <div className="flex mt-5 sm:mt-0">
                        <Menu className="w-1/2 sm:w-auto">
                            <Menu.Button
                                as={Button}
                                variant="outline-secondary"
                                className="w-full sm:w-auto"
                            >
                                <Lucide
                                    icon="FileText"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Экспорт
                                <Lucide
                                    icon="ChevronDown"
                                    className="w-4 h-4 ml-auto sm:ml-2"
                                />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                                <Menu.Item onClick={onExportCsv}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт CSV
                                </Menu.Item>
                                <Menu.Item onClick={onExportJson}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт JSON
                                </Menu.Item>
                                <Menu.Item onClick={onExportXlsx}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт XLSX
                                </Menu.Item>
                                <Menu.Item onClick={onExportHtml}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт HTML
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div id="tabulator" ref={tableRef} className="mt-5"></div>
                </div>
            </div>
            {/* END: HTML Table Data */}
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
            <Dialog
                id="form-modal"
                open={createModal}
                onClose={() => {
                    setCreateModal(false);
                    dispatch(clientActions.resetClientByPhone());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setCreateModal(false);
                            dispatch(clientActions.resetClientByPhone());
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Icon icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ClientForm
                        onCreate={onCreate}
                        onSave={onSave}
                        setIsLoaderOpen={setIsLoaderOpen}
                        isLoaderOpen={isLoaderOpen}
                    />
                </Dialog.Panel>
            </Dialog>
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
