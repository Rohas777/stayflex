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
import { userSlice } from "@/stores/reducers/users/slice";
import {
    createUser,
    deleteUser,
    fetchAdmins,
    fetchUserById,
    fetchUsers,
    updateUserAdmin,
    updateUserIsActive,
    updateUserTariff,
} from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { Status } from "@/stores/reducers/types";
import { ListPlus } from "lucide-react";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Toastify from "toastify-js";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import {
    UserCreateType,
    UserTariffUpdateType,
    UserUpdateType,
} from "@/stores/reducers/users/types";
import Notification from "@/components/Base/Notification";
import clsx from "clsx";
import UserCreateModal from "./createModal";
import UserUpdateModal from "./updateModal";
import { fetchTariffs } from "@/stores/reducers/tariffs/actions";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { tariffSlice } from "@/stores/reducers/tariffs/slice";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    active?: boolean;
    objects?: number;
    subscription?: DateTime;
}

function Main() {
    const [userData, setUserData] = useState<{
        name: string;
        id: number;
    } | null>(null);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [createModalPreview, setCreateModalPreview] = useState(false);
    const [updateModalPreview, setUpdateModalPreview] = useState(false);

    const [confirmationModalPreview, setConfirmationModalPreview] =
        useState(false);
    const [switcherIsActive, setSwitcherIsActive] =
        useState<HTMLInputElement | null>(null);
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

    const navigate = useNavigate();

    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "name",
        type: "like",
        value: "",
    });

    const [tableData, setTableData] = useState<Response[]>([]);

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
                        title: "Действия",
                        minWidth: 200,
                        field: "id",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        // resizable: false,
                        headerSort: false,
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex lg:justify-center items-center"></div>`
                            );
                            const editA =
                                stringToHTML(`<a class="flex items-center mr-3 w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="pencil"></i>
                              </a>`);
                            const deleteA =
                                stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                            tippy(editA, {
                                content: "Редактировать",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            tippy(deleteA, {
                                content: "Удалить",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            const switcher = stringToHTML(
                                `<label class="inline-flex items-center cursor-pointer mr-3">
                                    <input type="checkbox" ${
                                        response.active ? "checked" : ""
                                    }  class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>`
                            );
                            tippy(switcher, {
                                content: "Активен?",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            a.append(switcher, editA, deleteA);
                            a.addEventListener("hover", function () {});
                            deleteA.addEventListener("click", function () {
                                setConfirmModalContent({
                                    title: "Удалить пользователя?",
                                    description: `Вы уверены, что хотите удалить пользователя "${response.name?.trim()}"?<br/>Это действие нельзя будет отменить.`,
                                    onConfirm: () => {
                                        onDelete(response.id!);
                                    },
                                    confirmLabel: "Удалить",
                                    cancelLabel: "Отмена",
                                    is_danger: true,
                                });
                                setConfirmationModalPreview(true);
                            });
                            editA.addEventListener("click", function () {
                                dispatch(fetchUserById(response.id!));
                                dispatch(fetchTariffs());
                                setUpdateModalPreview(true);
                            });

                            switcher.addEventListener("change", (e) => {
                                const target = e.target as HTMLInputElement;
                                setSwitcherIsActive(target);
                                if (!target.checked) {
                                    target.checked = true;
                                    setConfirmModalContent({
                                        title: "Деактивировать пользователя?",
                                        description: `Вы уверены, что хотите деактивировать пользователя "${response.name?.trim()}"?<br/>Он больше не будет иметь доступа к сервису.`,
                                        onConfirm: () => {
                                            onUpdateIsActive(
                                                target,
                                                response.id!
                                            );
                                        },
                                        confirmLabel: "Деактивировать",
                                        cancelLabel: "Отмена",
                                        is_danger: false,
                                    });
                                    setConfirmationModalPreview(true);
                                } else {
                                    onUpdateIsActive(target, response.id!);
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
                        title: "OBJECTS",
                        field: "objects",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "SUBSCRIPTION",
                        field: "subscription",
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
            tabulator.current.setFilter("name", "like", filter.value);
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

    const { setErrorToast } = errorToastSlice.actions;

    const {
        users,
        status,
        error,
        isCreated,
        isDeleted,
        isUpdated,
        isActiveStatusUpdated,
        statusOne,
    } = useAppSelector((state) => state.user);
    const tariffState = useAppSelector((state) => state.tariff);
    const userActions = userSlice.actions;
    const tariffActions = tariffSlice.actions;
    const dispatch = useAppDispatch();

    const onDelete = async (id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(deleteUser(String(id)));
    };
    const onUpdateIsActive = async (target: HTMLInputElement, id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(updateUserIsActive({ id: id }));
    };

    const onCreate = async (user: UserCreateType) => {
        await dispatch(createUser(user));
    };
    const onUpdate = async (user: UserUpdateType) => {
        await dispatch(updateUserAdmin(user));
    };

    useEffect(() => {
        if (status === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);
            dispatch(userActions.resetStatus());
        }
        if (statusOne === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);
            dispatch(userActions.resetStatusOne());
        }
    }, [status, statusOne, error]);

    useEffect(() => {
        if (statusOne === Status.ERROR || status === Status.ERROR) {
            dispatch(setErrorToast({ message: error!, isError: true }));
            stopLoader(setIsLoaderOpen);
        }
        if (isActiveStatusUpdated) {
            switcherIsActive!.checked = !switcherIsActive!.checked;
        }
        if (isCreated || isUpdated || isActiveStatusUpdated || isDeleted) {
            dispatch(fetchAdmins());
            setCreateModalPreview(false);
            setConfirmationModalPreview(false);
            setUpdateModalPreview(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Администратор успешно создан"
                : isDeleted
                ? "Администратор успешно удалён"
                : "Администратор успешно обновлен";
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
            dispatch(userActions.resetIsCreated());
            dispatch(userActions.resetIsUpdated());
            dispatch(userActions.resetIsDeleted());
            dispatch(userActions.resetIsActiveStatusUpdated());
            stopLoader(setIsLoaderOpen);
        }
    }, [
        isCreated,
        isUpdated,
        isActiveStatusUpdated,
        isDeleted,
        statusOne,
        status,
    ]);

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchAdmins());
    }, []);
    useEffect(() => {
        if (users && users.length) {
            const formattedData = users.map((user) => ({
                id: user.id,
                name: user.fullname,
                active: user.is_active,
                objects: user.object_count,
                subscription: DateTime.fromISO(user.date_before),
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [users]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Администраторы</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            dispatch(fetchTariffs());
                            setCreateModalPreview(true);
                        }}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && !isLoaderOpen && (
                    <div className="absolute z-50 bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                )}
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
                            <label className="whitespace-nowrap flex-none mr-2 xl:w-auto xl:flex-initial">
                                Поиск по названию
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
            {/* BEGIN: Modal Content */}
            <Dialog
                open={createModalPreview}
                onClose={() => {
                    setCreateModalPreview(false);
                    dispatch(userActions.resetUserOne());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setCreateModalPreview(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <UserCreateModal
                        isLoaderOpen={isLoaderOpen}
                        setIsLoaderOpen={setIsLoaderOpen}
                        onCreate={onCreate}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
            {/* BEGIN: Modal Content */}
            <Dialog
                open={updateModalPreview}
                onClose={() => {
                    setUpdateModalPreview(false);
                    dispatch(userActions.resetUserOne());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setUpdateModalPreview(false);
                            dispatch(userActions.resetUserOne());
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <UserUpdateModal
                        isLoaderOpen={isLoaderOpen}
                        setIsLoaderOpen={setIsLoaderOpen}
                        onUpdateUser={onUpdate}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
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
