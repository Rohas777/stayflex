import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import * as xlsx from "xlsx";
import { useEffect, useRef, createRef, useState, ChangeEvent } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "@/utils/helper";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { deleteUser, fetchUserById } from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import {
    deleteObject,
    fetchObjectById,
    fetchObjects,
    fetchObjectsByUser,
    updateObiectIsActive,
} from "@/stores/reducers/objects/actions";
import { objectSlice } from "@/stores/reducers/objects/slice";
import clsx from "clsx";
import Toastify from "toastify-js";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Notification from "@/components/Base/Notification";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import Calendar from "@/components/Calendar";
import ReservationsCalendar from "./calendar";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import {
    createReservation,
    deleteReservation,
    fetchReservationsByObject,
    updateReservation,
} from "@/stores/reducers/reservations/actions";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import { clientSlice } from "@/stores/reducers/clients/slice";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { userSlice } from "@/stores/reducers/users/slice";
import Icon from "@/components/Custom/Icon";
import useCopyToClipboard from "@/utils/useCopy";
import ExportMenu from "@/components/Custom/ExportMenu";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    owner?: string;
    active?: boolean;
    type?: string;
    reservation_count?: number;
}

function Main() {
    const [reservationModal, setReservationModal] = useState(false);
    const [calendarModal, setCalendarModal] = useState(false);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [currentObjectID, setCurrentObjectID] = useState<number | null>(null);
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
    const [isCopied, copyToClipboard] = useCopyToClipboard();

    const navigate = useNavigate();

    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "name",
        type: "like",
        value: "",
    });

    const { authorizedUser } = useAppSelector((state) => state.user);
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
                            return `<a href="/object/${response.id}" target="_blank" class="absolute inset-0 h-full items-center justify-between flex w-full font-medium whitespace-nowrap hover:text-primary">${response.name}<i data-lucide="external-link" class="size-4"></i></a>`;
                        },
                    },
                    {
                        title: "Тип",
                        minWidth: 200,
                        field: "type",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.type}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Броней",
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
                            return `<a href="/admin/reservations/object/${response.id}/" target="_blank" class="absolute inset-0 h-full items-center justify-center flex w-full font-medium whitespace-nowrap hover:text-primary">
                                        ${response.reservation_count}
                                        <i data-lucide="external-link" class="absolute top-1/2 -translate-y-1/2 right-2 size-4"></i>
                                    </a>`;
                        },
                    },
                    {
                        title: "Действия",
                        minWidth: 210,
                        field: "actions",
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
                                    <input type="checkbox" ${
                                        response.active ? "checked" : ""
                                    } class="sr-only peer">
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
                            dateA.addEventListener("click", function () {
                                dispatch(
                                    fetchReservationsByObject(response.id!)
                                );
                                dispatch(fetchObjectById(response.id!));
                                setCurrentObjectID(response.id!);
                                setCalendarModal(true);
                            });
                            editA.addEventListener("click", function () {
                                navigate(
                                    `${
                                        authorizedUser?.is_admin ? "/admin" : ""
                                    }/objects/update/${response.id}`
                                );
                            });
                            deleteA.addEventListener("click", function () {
                                setConfirmModalContent({
                                    title: "Удалить объект?",
                                    description: `Вы уверены, что хотите удалить объект "${response.name?.trim()}"?<br/>Это действие нельзя будет отменить.`,
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

    const onCreateReservation = async (
        reservationData: ReservationCreateType
    ) => {
        await dispatch(createReservation(reservationData));
    };
    const onUpdateReservation = async (
        reservationData: ReservationUpdateType
    ) => {
        await dispatch(updateReservation(reservationData));
    };
    const onDeleteReservation = async (id: number) => {
        await dispatch(deleteReservation(String(id)));
    };

    const onDelete = async (id: number) => {
        startLoader(setIsLoaderOpen);
        await dispatch(deleteObject(id));
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
    const reservationState = useAppSelector((state) => state.reservation);
    const reservationActions = reservationSlice.actions;
    const clientActions = clientSlice.actions;
    const userActions = userSlice.actions;
    const userOne = useAppSelector((state) => state.user.userOne);
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const clientsState = useAppSelector((state) => state.client);
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
        if (status === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);

            dispatch(objectActions.resetStatus());
        }
        if (
            reservationState.statusAll === Status.ERROR &&
            reservationState.error
        ) {
            dispatch(
                setErrorToast({
                    message: reservationState.error,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(reservationActions.resetStatus());
        }
        if (
            reservationState.statusOne === Status.ERROR &&
            reservationState.error
        ) {
            dispatch(
                setErrorToast({
                    message: reservationState.error,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(reservationActions.resetStatusOne());
        }
        if (
            clientsState.statusByPhone === Status.ERROR &&
            clientsState.errorByPhone
        ) {
            dispatch(
                setErrorToast({
                    message: clientsState.errorByPhone,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(clientActions.resetClientByPhone());
        }
        if (userState.statusOne === Status.ERROR && userState.error) {
            dispatch(
                setErrorToast({
                    message: userState.error,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(userActions.resetStatusOne());
        }
    }, [
        status,
        error,
        reservationState.statusAll,
        reservationState.error,
        reservationState.statusOne,
        clientsState.statusByPhone,
        clientsState.errorByPhone,
        userState.statusOne,
        userState.error,
    ]);

    useEffect(() => {
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
                ? "Объект успешно создан"
                : isDeleted
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
        if (
            !reservationState.isCreated &&
            !reservationState.isUpdated &&
            !reservationState.isDeleted
        ) {
            stopLoader(setIsLoaderOpen);
        }

        if (
            reservationState.isCreated ||
            reservationState.isUpdated ||
            reservationState.isDeleted
        ) {
            dispatch(fetchReservationsByObject(currentObjectID!));
            dispatch(fetchObjectById(currentObjectID!));
            setReservationModal(false);
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.querySelector(".text-content")!.textContent =
                reservationState.isCreated
                    ? "Бронь успешно создана"
                    : reservationState.isDeleted
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
            dispatch(reservationActions.resetIsCreated());
            dispatch(reservationActions.resetIsUpdated());
            dispatch(reservationActions.resetIsDeleted());
            dispatch(clientActions.resetClientByPhone());
        }
    }, [
        reservationState.isCreated,
        reservationState.isUpdated,
        reservationState.isDeleted,
    ]);

    const params = useParams();

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchObjectsByUser({ id: Number(params.id) }));
        dispatch(fetchUserById(Number(params.id)));
        dispatch(objectActions.resetObjectOne());
    }, []);

    useEffect(() => {
        if (objects.length) {
            const formattedData = objects.map((object) => ({
                id: object.id,
                name: object.name,
                owner: object.author.fullname,
                active: object.active,
                type: object.apartment.name,
                reservation_count: object.reservation_count,
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [objects]);

    const onCopy = () => {
        copyToClipboard(window.location.origin + "/objects/" + params.id);
    };

    useEffect(() => {
        if (!isCopied) return;

        const successEl = document
            .querySelectorAll("#success-notification-content")[0]
            .cloneNode(true) as HTMLElement;
        successEl.querySelector(".text-content")!.textContent =
            "Ссылка на страницу скопирована в буфрер обмена";
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
    }, [isCopied]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="flex items-start mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">
                    Объекты пользователя
                    <br />{" "}
                    <span className="text-slate-500 text-sm">
                        {userOne?.fullname}
                    </span>
                </h2>
                <ExportMenu tabulator={tabulator} />
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
                    <div className="flex items-center w-full mt-4 sm:w-auto sm:mt-0">
                        <Link
                            to={"/objects/" + params.id}
                            target="_blank"
                            className="flex flex-grow"
                        >
                            <Button
                                variant="secondary"
                                className="flex-grow mr-2 shadow-md whitespace-nowrap"
                            >
                                Страница объектов
                                <Icon
                                    icon="ExternalLink"
                                    className="size-5 ml-2"
                                />
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            className="shadow-md"
                            onClick={onCopy}
                        >
                            <Icon icon="Copy" className="size-5" />
                        </Button>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div id="tabulator" ref={tableRef} className="mt-5"></div>
                </div>
            </div>
            {/* END: HTML Table Data */}

            {/* BEGIN: Calendar Modal */}
            <Dialog
                open={calendarModal}
                onClose={() => {
                    setCalendarModal(false);
                }}
                size="xl"
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setCalendarModal(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ReservationsCalendar
                        isLoaderOpen={isLoaderOpen}
                        setIsLoaderOpen={setIsLoaderOpen}
                        objectID={currentObjectID!}
                        onCreate={onCreateReservation}
                        onUpdate={onUpdateReservation}
                        onDelete={onDeleteReservation}
                        reservationModal={reservationModal}
                        setReservationModal={setReservationModal}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Calendar Modal */}
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
                        Объект успешно добавлен
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
