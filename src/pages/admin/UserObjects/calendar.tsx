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
import { fetchObjectById } from "@/stores/reducers/objects/actions";

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
    const { authorizedUser } = useAppSelector((state) => state.user);
    const { objectOne } = useAppSelector((state) => state.object);
    const reservationActions = reservationSlice.actions;
    const clientActions = clientSlice.actions;
    const dispatch = useAppDispatch();

    const options: CalendarOptions = {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listYear",
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
            if (formatDate(props.date) < formatDate(new Date()))
                return ["bg-slate-100"];
            return [];
        },
        eventClick: (info) => {
            setCurrentReservation(info.event.extendedProps.reservation);
            setCurrentUnreservedData(null);
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
        //FIXME -
        setEvents(
            reservations.map((reservation) => {
                const status = reservationEventType(reservation?.status as any);
                return {
                    title: reservation.client.fullname,
                    start: reservation.start_date,
                    end: reservation.end_date + "T12:00:01",
                    extendedProps: { reservation: reservation },
                    classNames: status.classNames,
                    textColor: status.textColor,
                };
            })
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
                    dispatch(fetchObjectById(objectID));
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setReservationModal(false);
                            dispatch(clientActions.resetClientByPhone());
                            dispatch(fetchObjectById(objectID));
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
