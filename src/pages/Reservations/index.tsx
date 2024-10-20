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
import tippy from "tippy.js";
import { Link } from "react-router-dom";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import {
    createReservation,
    fetchReservationById,
    fetchReservations,
    updateReservationStatus,
} from "@/stores/reducers/reservations/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import InfoModal from "./info";
import { convertDateString, stopLoader } from "@/utils/customUtils";
import ReservationForm from "./form";
import { ReservationCreateType } from "@/stores/reducers/reservations/types";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import { fetchObjects } from "@/stores/reducers/objects/actions";
import { clientSlice } from "@/stores/reducers/clients/slice";
import { di } from "@fullcalendar/core/internal-common";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

window.DateTime = DateTime;
interface Response {
    id?: number;
    object?: string;
    date?: string;
    name?: string;
    status?: string;
    phone?: string;
    email?: string;
}

function Main() {
    const [buttonModalInfo, setButtonModalInfo] = useState(false);
    const [buttonModalCreate, setButtonModalCreate] = useState(false);
    const [rowAcionFocus, setRowAcionFocus] = useState<Response | null>(null);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

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
                        title: "Объект",
                        minWidth: 200,
                        responsive: 0,
                        field: "object",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.object}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Дата",
                        minWidth: 200,
                        field: "date",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.date}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Имя",
                        minWidth: 200,
                        field: "name",
                        hozAlign: "center",
                        headerHozAlign: "center",
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
                        title: "Статус",
                        minWidth: 200,
                        field: "status",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex lg:justify-center items-center"></div>`
                            );
                            const statuses = [
                                {
                                    value: "new",
                                    label: "Новая",
                                },
                                {
                                    value: "approved",
                                    label: "Одобрена",
                                },
                                {
                                    value: "rejected",
                                    label: "Отклонена",
                                },
                                {
                                    value: "completed",
                                    label: "Пройдена",
                                },
                            ];

                            const options = statuses.map((status) => {
                                return `<option value="${status.value}" ${
                                    response.status === status.value
                                        ? "selected"
                                        : ""
                                }>${status.label}</option>`;
                            });

                            const selector =
                                stringToHTML(`<select class="min-w-40 cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    ${options.join("")}
                                    </select>`);
                            a.append(selector);
                            a.addEventListener("hover", function () {});
                            selector.addEventListener("change", function () {
                                const value = (this as HTMLSelectElement).value;
                                onUpdateStatus({
                                    id: response.id!,
                                    status: value,
                                });
                            });
                            return a;
                        },
                    },
                    {
                        minWidth: 50,
                        maxWidth: 100,
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
                                `<div class="flex lg:justify-center items-center"></div>`
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
                            a.addEventListener("hover", function () {});
                            info.addEventListener("click", function (event) {
                                event.preventDefault();
                                const row = tableData.find(
                                    (row) => row.id === response.id
                                );
                                dispatch(fetchReservationById(response.id!));
                                setRowAcionFocus(row ? row : null);
                                setButtonModalInfo(true);
                            });
                            return a;
                        },
                    },

                    // For print format
                    {
                        title: "OBJECT",
                        field: "object",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "DATE",
                        field: "date",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "NAME",
                        field: "name",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "STATUS",
                        field: "status",
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
            tabulator.current.setFilter("object", "like", filter.value);
        }
    };
    const onResetFilter = () => {
        setFilter({
            ...filter,
            field: "object",
            type: "like",
            value: "",
        });
        if (tabulator.current) {
            tabulator.current.setFilter("object", "like", "");
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

    const {
        reservations,
        reservationById,
        statusByID,
        statusAll,
        isCreated,
        isUpdated,
        error,
    } = useAppSelector((state) => state.reservation);
    const { resetIsCreated, resetIsUpdated } = reservationSlice.actions;

    const { resetClientByPhone } = clientSlice.actions;

    const dispatch = useAppDispatch();

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchReservations());
    }, []);

    useEffect(() => {
        if (reservations.length) {
            const formattedData = reservations.map((reservation) => ({
                id: reservation.id,
                object: reservation.object.name,
                date:
                    convertDateString(reservation.start_date) +
                    " - " +
                    convertDateString(reservation.end_date),
                name: reservation.client.fullname,
                status: reservation.status,
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [reservations]);

    const onCreate = async (reservationData: ReservationCreateType) => {
        await dispatch(createReservation(reservationData));
    };
    const onUpdateStatus = async (reservationData: {
        id: number;
        status: string;
    }) => {
        await dispatch(updateReservationStatus(reservationData));
    };
    useEffect(() => {
        if (statusByID === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            console.log(error);
        }
        if (isCreated || isUpdated) {
            dispatch(fetchReservations());
            setButtonModalCreate(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Бронь успешно добавлена"
                : "Бронь успешно обновлена";
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
            dispatch(resetIsCreated());
            dispatch(resetIsUpdated());
            dispatch(resetClientByPhone());
        }
    }, [isCreated, statusByID, isUpdated]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Брони</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalCreate(true);
                            dispatch(fetchObjects());
                        }}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {statusAll === Status.LOADING && (
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
                open={buttonModalInfo}
                onClose={() => {
                    setButtonModalInfo(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalInfo(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <InfoModal />
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
            {/* BEGIN: Form Modal */}
            <Dialog
                size="lg"
                id="reservation-form-modal"
                open={buttonModalCreate}
                onClose={() => {
                    setButtonModalCreate(false);
                    dispatch(resetClientByPhone());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalCreate(false);
                            dispatch(resetClientByPhone());
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ReservationForm
                        onCreate={onCreate}
                        setIsLoaderOpen={setIsLoaderOpen}
                        isLoaderOpen={isLoaderOpen}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Form Modal */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content">
                        Бронь успешно добавлена
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
