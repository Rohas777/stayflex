import "@/assets/css/vendors/full-calendar.css";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CalendarOptions, EventSourceInput } from "@fullcalendar/core";
import { formatDate } from "@/utils/dateFormatter";
import ruLocale from "@fullcalendar/core/locales/ru";
import { useEffect, useState } from "react";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import { Dialog } from "@/components/Base/Headless";
import { clientSlice } from "@/stores/reducers/clients/slice";
import ReservationForm from "./form";
import Lucide from "@/components/Base/Lucide";
import { IReservation } from "@/stores/models/IReservation";

interface ReservationsCalendarProps {
    isLoaderOpen: boolean;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    objectID: number;
    onCreate: (reservation: ReservationCreateType) => void;
    onUpdate: (reservation: ReservationUpdateType) => void;
    onDelete: (id: number) => void;
    reservationModal: boolean;
    setReservationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReservationsCalendar({
    isLoaderOpen,
    setIsLoaderOpen,
    reservationModal,
    setReservationModal,
    objectID,
    onCreate,
    onDelete,
    onUpdate,
}: ReservationsCalendarProps) {
    const [currentUnreservedData, setCurrentUnreservedData] = useState<{
        start_date: string;
        objectID: number;
    } | null>(null);
    const [events, setEvents] = useState<EventSourceInput>([]);
    const [currentReservation, setCurrentReservation] =
        useState<IReservation | null>(null);

    const { reservations, statusAll } = useAppSelector(
        (state) => state.reservation
    );
    const reservationActions = reservationSlice.actions;
    const clientActions = clientSlice.actions;
    const dispatch = useAppDispatch();

    const options: CalendarOptions = {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        locale: ruLocale,
        weekNumberCalculation: "ISO",
        initialDate: formatDate(new Date()),
        navLinks: true,
        navLinkDayClick: (date, jsEvent) => {
            return;
        },
        dayMaxEvents: true,
        buttonText: {
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            list: "Список",
        },
        displayEventTime: false,
        events: events,
        eventClassNames: (info) => {
            return ["cursor-pointer", "transition", "hover:opacity-80"];
        },
        dayCellClassNames: (props) => {
            return ["cursor-pointer"];
        },
        eventClick: (info) => {
            setCurrentReservation(info.event.extendedProps.reservation);
            setCurrentUnreservedData(null);
            setReservationModal(true);
        },
        dateClick: (info) => {
            const foundEvent = (
                events as [
                    {
                        start: string;
                        end: string;
                        extendedProps: { reservation: IReservation };
                    }
                ]
            ).find((event) => {
                return !(
                    info.dateStr < event.start || info.dateStr > event.end
                );
            });

            if (foundEvent) {
                setCurrentReservation(foundEvent.extendedProps.reservation);
                setCurrentUnreservedData(null);
            } else {
                setCurrentReservation(null);
                setCurrentUnreservedData({
                    start_date: info.dateStr,
                    objectID: objectID,
                });
            }

            setReservationModal(true);
        },
    };

    const reservationEventType = (
        status: "new" | "completed" | "approved" | "rejected"
    ) => {
        switch (status) {
            case "new":
                return {
                    textColor: "white",
                    classNames: ["!bg-warning", "!border-warning"],
                };
            case "completed":
                return {
                    textColor: "black",
                    classNames: ["!bg-slate-200", "!border-slate-200"],
                };
            case "approved":
                return {
                    textColor: "white",
                    classNames: ["!bg-success", "!border-success"],
                };
            case "rejected":
                return {
                    textColor: "white",
                    classNames: ["!bg-danger", "!border-danger"],
                };
        }
    };

    useEffect(() => {
        const tempReservations = [
            {
                title: "Завершена",
                start: "2024-10-01",
                end: "2024-10-04T12:00:01",
                extendedProps: {
                    reservation: {
                        start_date: "string",
                        end_date: "string",
                        id: 1,
                        status: "completed",
                        description: "string",
                        client: {
                            id: 1,
                            fullname: "string",
                            phone: "string",
                            email: "string",
                        },
                        object: {
                            id: 1,
                            name: "string",
                        },
                    },
                },
            },
            {
                title: "Отменена",
                start: "2024-10-05",
                end: "2024-10-07T12:00:01",
                extendedProps: {
                    reservation: {
                        start_date: "string",
                        end_date: "string",
                        id: 1,
                        status: "rejected",
                        description: "string",
                        client: {
                            id: 1,
                            fullname: "string",
                            phone: "string",
                            email: "string",
                        },
                        object: {
                            id: 1,
                            name: "string",
                        },
                    },
                },
            },
            {
                title: "Одобрена",
                start: "2024-10-08",
                end: "2024-10-10T12:00:01",
                extendedProps: {
                    reservation: {
                        start_date: "string",
                        end_date: "string",
                        id: 1,
                        status: "approved",
                        description: "string",
                        client: {
                            id: 1,
                            fullname: "string",
                            phone: "string",
                            email: "string",
                        },
                        object: {
                            id: 1,
                            name: "string",
                        },
                    },
                },
            },
            {
                title: "Новая",
                start: "2024-10-12",
                end: "2024-10-18T12:00:01",
                extendedProps: {
                    reservation: {
                        start_date: "string",
                        end_date: "string",
                        id: 1,
                        status: "new",
                        description: "string",
                        client: {
                            id: 1,
                            fullname: "string",
                            phone: "string",
                            email: "string",
                        },
                        object: {
                            id: 1,
                            name: "string",
                        },
                    },
                },
            },
        ];

        //FIXME -
        setEvents(
            tempReservations.map((reservation) => {
                const status = reservationEventType(
                    reservation.extendedProps.reservation.status as any
                );
                return {
                    ...reservation,
                    classNames: status.classNames,
                    textColor: status.textColor,
                };
            })
            // reservations.map((reservation) => {
            //     const status = reservationEventType(reservation.status);
            //     return {
            //         title: reservation.client.fullname,
            //         start: reservation.start_date,
            //         end: reservation.end_date + "T12:00:01",
            //         classNames: status.classNames,
            //         color: status.color,
            //         extendedProps: { reservation: reservation },
            //     };
            // })
        );
    }, [statusAll]);

    if (statusAll === Status.LOADING && !isLoaderOpen) {
        return <Loader />;
    }

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5 text-center">
                <div className="my-5 text-3xl">
                    Календарь бронирования объекта
                </div>
                <div className="mt-2 text-slate-500">
                    {/* BEGIN: Calendar Content */}
                    <div className="full-calendar">
                        <FullCalendar {...options} />
                    </div>
                    {/* END: Calendar Content */}
                </div>
            </div>

            {/* BEGIN: Form Modal */}
            <Dialog
                size="lg"
                id="reservation-form-modal"
                open={reservationModal}
                onClose={() => {
                    setReservationModal(false);
                    dispatch(clientActions.resetClientByPhone());
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setReservationModal(false);
                            dispatch(clientActions.resetClientByPhone());
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <ReservationForm
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        setIsLoaderOpen={setIsLoaderOpen}
                        isLoaderOpen={isLoaderOpen}
                        currentUnreservedData={currentUnreservedData}
                        currentReservation={
                            currentReservation ? currentReservation : undefined
                        }
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Form Modal */}
        </>
    );
}

export default ReservationsCalendar;
