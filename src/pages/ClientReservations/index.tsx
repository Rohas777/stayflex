import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import * as xlsx from "xlsx";
import React, { useEffect, useRef, createRef, useState } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "@/utils/helper";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { userSlice } from "@/stores/reducers/users/slice";
import { deleteUser, fetchUsers } from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link, useLocation, useParams } from "react-router-dom";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import {
    fetchReservations,
    fetchReservationsByClient,
} from "@/stores/reducers/reservations/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { convertDateString } from "@/utils/customUtils";

window.DateTime = DateTime;
interface Response {
    id?: number;
    object?: string;
    date?: string;
    status?: string;
}

function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [rowAcionFocus, setRowAcionFocus] = useState<Response | null>(null);
    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "name",
        type: "like",
        value: "",
    });
    const [clientData, setClientData] = useState({
        name: "Иванов И.И.",
        phone: "+7 (777) 777-77-77",
        email: "email@gmail.com",
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
                        title: "ОБЪЕКТ",
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
                        title: "ДАТА",
                        minWidth: 200,
                        responsive: 0,
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
                        title: "СТАТУС",
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
                                    label: "Завершена",
                                },
                            ];
                            const currentStatus = statuses.find(
                                (status) => status.value === response.status
                            );
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${currentStatus?.label}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "",
                        minWidth: 50,
                        maxWidth: 100,
                        field: "",
                        responsive: 1,
                        hozAlign: "right",
                        vertAlign: "middle",
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
                                setRowAcionFocus(row ? row : null);
                                setButtonModalPreview(true);
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

    const { reservations, statusAll, error } = useAppSelector(
        (state) => state.reservation
    );
    const {} = reservationSlice.actions;
    const dispatch = useAppDispatch();

    const params = useParams();

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();
        dispatch(fetchReservationsByClient(Number(params.id!)));
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

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">
                    Список броней клиента - {clientData.name}
                </h2>
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
                open={buttonModalPreview}
                onClose={() => {
                    setButtonModalPreview(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalPreview(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <div className="p-5">
                        <div className="mt-5 text-lg font-bold text-center">
                            Booking information
                        </div>
                        <ul className="mt-7">
                            <li>
                                <strong className="inline-block w-20">
                                    Объект:
                                </strong>
                                {rowAcionFocus?.object}
                            </li>
                            <li>
                                <strong className="inline-block mt-3 w-20">
                                    Имя:
                                </strong>
                                {clientData.name}
                            </li>
                            <li>
                                <strong className="inline-block mt-3 w-20">
                                    Номер:
                                </strong>
                                {clientData.phone}
                            </li>
                            <li>
                                <strong className="inline-block mt-3 w-20">
                                    Email:
                                </strong>
                                {clientData.email}
                            </li>
                            <li>
                                <strong className="inline-block mt-3 mb-10 w-20">
                                    Дата:
                                </strong>
                                {rowAcionFocus?.date}
                            </li>
                        </ul>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
        </>
    );
}

export default Main;
