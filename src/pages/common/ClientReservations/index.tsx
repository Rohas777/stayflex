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
import { Link, useParams } from "react-router-dom";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import {
    createReservation,
    deleteReservation,
    fetchReservationById,
    fetchReservationsByClient,
    updateReservation,
    updateReservationStatus,
} from "@/stores/reducers/reservations/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import {
    convertDateString,
    convertStringDate,
    startLoader,
    stopLoader,
} from "@/utils/customUtils";
import ReservationForm from "./form";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import Toastify from "toastify-js";
import Notification from "@/components/Base/Notification";
import {
    fetchObjectById,
    fetchObjects,
} from "@/stores/reducers/objects/actions";
import { clientSlice } from "@/stores/reducers/clients/slice";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import clsx from "clsx";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { fetchClientByID } from "@/stores/reducers/clients/actions";
import { objectSlice } from "@/stores/reducers/objects/slice";
import { reservationStatus } from "@/vars";
import ExportMenu from "@/components/Custom/ExportMenu";

window.DateTime = DateTime;
interface Response {
    id?: number;
    object_id?: number;
    object_name?: string;
    date?: string;
    name?: string;
    status?: string;
    phone?: string;
    email?: string;
}

function Main() {
    const [buttonModalCreate, setButtonModalCreate] = useState(false);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [statusSelector, setStatusSelector] =
        useState<HTMLSelectElement | null>(null);
    const [selectedStatus, setSelectedStatus] =
        useState<reservationStatus>("new");
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
                pagination: true,
                paginationSize: 10,
                paginationSizeSelector: [10, 20, 50, 100],
                layout: "fitColumns",
                responsiveLayout: "collapse",
                placeholder: "Записи не найдены",
                columns: [
                    {
                        title: "",
                        field: "",
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
                        maxWidth: 50,
                        responsive: 0,
                        field: "id",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.id}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Объект",
                        minWidth: 200,
                        responsive: 0,
                        field: "object_name",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.object_name}</div>
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
                        sorter: function (a, b) {
                            const startA = convertStringDate(a.split(" - ")[0]);
                            const startB = convertStringDate(b.split(" - ")[0]);

                            a = new Date(startA).getTime();
                            b = new Date(startB).getTime();

                            if (a < b) return -1;
                            if (a > b) return 1;
                            return 0;
                        },
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.date}</div>
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
                            ];

                            const options = statuses.map((status) => {
                                return `<option value="${status.value}" ${
                                    response.status === status.value
                                        ? "selected"
                                        : ""
                                }>${status.label}</option>`;
                            });

                            let selector =
                                stringToHTML(`<select class="min-w-40 cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    ${options.join("")}
                                    </select>`);
                            if (response.status === "completed") {
                                selector = stringToHTML(
                                    `<span class="text-green-500">Завершена</span>`
                                );
                            }
                            const prevStatus = response.status;
                            a.append(selector);
                            a.addEventListener("hover", function () {});
                            selector.addEventListener("change", function (e) {
                                e.preventDefault();
                                const target = this as HTMLSelectElement;
                                setStatusSelector(target);
                                setSelectedStatus(
                                    target.value as reservationStatus
                                );

                                onUpdateStatus({
                                    id: response.id!,
                                    status: target.value,
                                });
                                target.value = prevStatus!;
                            });
                            return a;
                        },
                    },
                    {
                        minWidth: 50,
                        maxWidth: 150,
                        title: "Действия",
                        field: "",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "right",
                        resizable: false,
                        headerSort: false,
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex justify-end h-full items-center"></div>`
                            );
                            const deleteA =
                                stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                            const editA =
                                stringToHTML(`<a class="flex items-center mr-3 w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="pencil"></i>
                              </a>`);
                            tippy(deleteA, {
                                content: "Удалить",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            tippy(editA, {
                                content: "Редактировать",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            editA.addEventListener("click", function () {
                                dispatch(fetchReservationById(response.id!));
                                dispatch(fetchObjectById(response.object_id!));
                                dispatch(fetchObjects());
                                setButtonModalCreate(true);
                            });
                            deleteA.addEventListener("click", function () {
                                setConfirmModalContent({
                                    title: "Удалить бронь?",
                                    description: `Вы уверены, что хотите удалить бронь "${response.object_name?.trim()} - ${response.date?.trim()}"?<br/>Это действие нельзя будет отменить.`,
                                    onConfirm: () => {
                                        console.log("first");
                                        onDelete(response.id!);
                                    },
                                    confirmLabel: "Удалить",
                                    cancelLabel: "Отмена",
                                    is_danger: true,
                                });
                                setConfirmationModal(true);
                            });
                            a.append(editA, deleteA);
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
            tabulator.current.setFilter([
                [
                    {
                        field: "object",
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
            field: "object",
            type: "like",
            value: "",
        });
        if (tabulator.current) {
            tabulator.current.setFilter("object", "like", "");
        }
    };

    const {
        reservations,
        reservationOne,
        statusOne,
        statusAll,
        isCreated,
        isUpdated,
        isDeleted,
        error,
    } = useAppSelector((state) => state.reservation);
    const {
        resetIsCreated,
        resetIsUpdated,
        resetIsDeleted,
        resetReservationOne,
        resetStatus,
        resetStatusOne,
    } = reservationSlice.actions;
    const clientState = useAppSelector((state) => state.client);
    const { authorizedUser } = useAppSelector((state) => state.user);

    const { resetClientByPhone } = clientSlice.actions;
    const clientActions = clientSlice.actions;
    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchReservationsByClient(Number(params.id!)));
        dispatch(fetchClientByID(Number(params.id!)));
    }, []);

    useEffect(() => {
        if (reservations.length) {
            const formattedData = reservations.map((reservation) => ({
                id: reservation.id,
                object_name: reservation.object.name,
                object_id: reservation.object.id,
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
        } else {
            tabulator.current?.setData([]).then(function () {
                reInitTabulator();
            });
        }
    }, [reservations]);

    const onCreate = async (reservationData: ReservationCreateType) => {
        await dispatch(createReservation(reservationData));
    };
    const onUpdate = async (reservationData: ReservationUpdateType) => {
        await dispatch(updateReservation(reservationData));
    };
    const onDelete = async (id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(deleteReservation(String(id)));
    };
    const onUpdateStatus = async (reservationData: {
        id: number;
        status: string;
    }) => {
        await dispatch(updateReservationStatus(reservationData));
    };
    const { setErrorToast } = errorToastSlice.actions;
    useEffect(() => {
        if (statusAll === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);

            dispatch(resetStatus());
        }
        if (statusOne === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);

            dispatch(resetStatusOne());
        }
    }, [statusAll, error, statusOne]);
    useEffect(() => {
        if (statusSelector) {
            statusSelector.value = selectedStatus;
        }
        if (isCreated || isUpdated || isDeleted) {
            dispatch(fetchReservationsByClient(Number(params.id!)));
            setButtonModalCreate(false);
            setConfirmationModal(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent = isCreated
                ? "Бронь успешно добавлена"
                : isDeleted
                ? "Бронь успешно удалена"
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
            dispatch(resetReservationOne());
            dispatch(resetIsCreated());
            dispatch(resetIsUpdated());
            dispatch(resetIsDeleted());
            dispatch(resetClientByPhone());
            dispatch(objectSlice.actions.resetObjectOne());
        }
    }, [isCreated, isUpdated, isDeleted]);

    return (
        <>
            <div className="flex mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">
                    Список броней клиента
                    <br />
                    <span className="text-slate-500 text-sm">
                        {clientState.clientOne?.fullname}
                    </span>
                </h2>
                <ExportMenu tabulator={tabulator} />
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
                <div className="flex flex-col-reverse sm:flex-row sm:items-end xl:items-start">
                    <form
                        id="tabulator-html-filter-form"
                        className="xl:flex sm:mr-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFilter();
                        }}
                    >
                        <div className="flex items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="whitespace-nowrap flex-none mr-2 xl:w-auto xl:flex-initial">
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
                    {!authorizedUser?.is_admin && (
                        <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                            <Button
                                as="a"
                                href="#"
                                variant="primary"
                                className="w-full shadow-md"
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
                    )}
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div id="tabulator" ref={tableRef} className="mt-5"></div>
                </div>
            </div>
            {/* END: HTML Table Data */}

            {/* BEGIN: Form Modal */}
            <Dialog
                size="lg"
                id="reservation-form-modal"
                open={buttonModalCreate}
                onClose={() => {
                    setButtonModalCreate(false);
                    dispatch(resetClientByPhone());
                    dispatch(resetReservationOne());
                    dispatch(objectSlice.actions.resetObjectOne());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalCreate(false);
                            dispatch(resetClientByPhone());
                            dispatch(resetReservationOne());
                            dispatch(objectSlice.actions.resetObjectOne());
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ReservationForm
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                        setIsLoaderOpen={setIsLoaderOpen}
                        isLoaderOpen={isLoaderOpen}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Form Modal */}
            {/* BEGIN: Confirmation Modal */}
            <Dialog
                open={confirmationModal}
                onClose={() => {
                    setConfirmationModal(false);
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
                                setConfirmationModal(false);
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
                        Бронь успешно добавлена
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
