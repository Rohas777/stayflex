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
import { deleteUser, fetchUsers } from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link } from "react-router-dom";
import { propertyTypeSlice } from "@/stores/reducers/property-types/slice";
import { fetchPropertyTypes } from "@/stores/reducers/property-types/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import {
    fetchObjects,
    updateObiectIsActive,
} from "@/stores/reducers/objects/actions";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { objectSlice } from "@/stores/reducers/objects/slice";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import clsx from "clsx";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
}

function Main() {
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const [switcherIsActive, setSwitcherIsActive] =
        useState<HTMLInputElement | null>(null);
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
                placeholder: "No matching records found",
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
                        title: "Название",
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
                        minWidth: 300,
                        title: "Действия",
                        field: "id",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "right",
                        resizable: false,
                        headerSort: false,
                        vertAlign: "middle",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex lg:justify-center items-center"></div>`
                            );
                            const dateA =
                                stringToHTML(`<a class="flex items-center mr-3 w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="calendar"></i>
                              </a>`);
                            const editA =
                                stringToHTML(`<a class="flex items-center mr-3 w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="pencil"></i>
                              </a>`);
                            const deleteA =
                                stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                            tippy(dateA, {
                                content: "Брони",
                                placement: "bottom",
                                animation: "shift-away",
                            });
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
                                    <input type="checkbox" value="" class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>`
                            );
                            tippy(switcher, {
                                content: "Активен?",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            a.append(switcher, dateA, editA, deleteA);
                            a.addEventListener("hover", function () {});
                            deleteA.addEventListener("click", function () {
                                setConfirmModalContent({
                                    title: "Удалить объект?",
                                    description: `Вы уверены, что хотите удалить объект "${response.name?.trim()}"?<br/>Это действие нельзя будет отменить.`,
                                    onConfirm: () => {
                                        onDelete(response.id!);
                                    },
                                    confirmLabel: "Удалить",
                                    cancelLabel: "Отмена",
                                    is_danger: true,
                                });
                                setConfirmationModal(true);
                            });
                            switcher.addEventListener("change", (e) => {
                                const target = e.target as HTMLInputElement;
                                setSwitcherIsActive(target);
                                if (!target.checked) {
                                    target.checked = true;
                                    setConfirmModalContent({
                                        title: "Деактивировать объект?",
                                        description: `Вы уверены, что хотите деактивировать объект "${response.name?.trim()}"?<br/>Он больше не будет выводится в виджете.`,
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
                                    setConfirmationModal(true);
                                } else {
                                    onUpdateIsActive(target, response.id!);
                                }
                            });
                            return a;
                        },
                    },

                    // For print format
                    {
                        title: "НАЗВАНИЕ",
                        field: "name",
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

    const onDelete = async (id: number) => {
        // await dispatch(deleteUser(id));
    };
    const onUpdateIsActive = async (target: HTMLInputElement, id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(updateObiectIsActive({ id: id }));
    };

    const {
        objects,
        status,
        error,
        isCreated,
        isUpdated,
        isActiveStatusUpdated,
        isDeleted,
    } = useAppSelector((state) => state.object);
    const objectActions = objectSlice.actions;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isCreated && !isUpdated && !isActiveStatusUpdated && !isDeleted) {
            stopLoader(setIsLoaderOpen);
        }
        if (isActiveStatusUpdated) {
            switcherIsActive!.checked = !switcherIsActive!.checked;
        }
        if (isCreated || isUpdated || isActiveStatusUpdated || isDeleted) {
            dispatch(fetchObjects());
            setConfirmationModal(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Объект успешно удалён"
                : "Объект успешно обновлен";
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
            dispatch(objectActions.resetIsCreated());
            dispatch(objectActions.resetIsUpdated());
            dispatch(objectActions.resetIsDeleted());
            dispatch(objectActions.resetIsActiveStatusUpdated());
        }
    }, [isCreated, isUpdated, isActiveStatusUpdated, isDeleted]);
    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchObjects());
    }, []);
    useEffect(() => {
        if (objects.length) {
            const formattedData = objects.map((object) => ({
                id: object.id,
                name: object.name,
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [objects]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Объекты</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Link to="create">
                        <Button variant="primary" className="mr-2 shadow-md">
                            <ListPlus className="size-5 mr-2" />
                            Добавить
                        </Button>
                    </Link>
                </div>
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && (
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
                            <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
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
            {/* BEGIN: Delete Confirmation Modal */}
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
            {/* END: Delete Confirmation Modal */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content">
                        Объект успешно добавлен
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
