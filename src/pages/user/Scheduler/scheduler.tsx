// import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler"; //FIXME - DELETE
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
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import listPlugin from "@fullcalendar/list";
import { CalendarOptions, EventSourceInput } from "@fullcalendar/core";
import { formatDate } from "@/utils/dateFormatter";
import ruLocale from "@fullcalendar/core/locales/ru";
import { createElement, useEffect, useRef, useState } from "react";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import { Dialog } from "@/components/Base/Headless";
import { clientSlice } from "@/stores/reducers/clients/slice";
import ReservationForm from "./form";
import Lucide from "@/components/Base/Lucide";
import { IReservation } from "@/stores/models/IReservation";
import { objectSlice } from "@/stores/reducers/objects/slice";
import { fetchObjectById } from "@/stores/reducers/objects/actions";
import { stringToHTML } from "@/utils/helper";
import { ResourceSourceInput } from "@fullcalendar/resource";
import { getObjectReservations } from "@/utils/customUtils";
import Icon from "@/components/Custom/Icon";

interface SchedulerProps {
    reservations: IReservation[];
    onClickEvent: (reservation_id: number) => void;
    onClickDate: (date: string, object_id: number) => void;
}

function Scheduler({
    reservations,
    onClickEvent,
    onClickDate,
}: SchedulerProps) {
    const [events, setEvents] = useState<EventSourceInput>([]);
    const [resources, setResources] = useState<ResourceSourceInput>([]);

    const { objectOne } = useAppSelector((state) => state.object);
    const { authorizedUser } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const findApprovedReservation = (date: string, objectID: number) => {
        const founded = reservations.filter((reservation) => {
            return (
                date >= reservation.start_date && date < reservation.end_date
            );
        });
        let filtered: IReservation | undefined;
        founded.forEach((reservation) => {
            if (
                reservation.object.id === objectID &&
                reservation.status === "approved"
            ) {
                filtered = reservation;
                return;
            }
        });

        return filtered;
    };

    const options: CalendarOptions = {
        plugins: [interactionPlugin, resourceTimelinePlugin],
        schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "resourceTimeline1Month,resourceTimeline2Month",
        },
        initialView: "resourceTimeline1Month",
        views: {
            resourceTimeline2Month: {
                type: "resourceTimeline",
                duration: { months: 2 },
                buttonText: "2 месяца",
            },
            resourceTimeline1Month: {
                type: "resourceTimeline",
                duration: { month: 1 },
                buttonText: "Месяц",
            },
        },
        height: "auto",
        locale: ruLocale,
        weekNumberCalculation: "ISO",
        initialDate: new Date(),
        navLinks: true,
        navLinkDayClick: (date, jsEvent) => {
            return;
        },
        resourceAreaHeaderContent: "Объекты",
        resourceAreaWidth: "20%",
        buttonText: {
            today: "Сегодня",
        },
        displayEventTime: false,
        // resourceGroupField: "building",
        resources: resources,
        events: events,
        eventClassNames: (info) => {
            return ["cursor-pointer", "transition", "hover:opacity-80"];
        },
        eventClick: (info) => {
            // if (
            //     info.event.extendedProps.reservation.end_date <
            //     formatDate(new Date())
            // )
            //     return;

            // if (authorizedUser?.id !== objectOne?.author.id) return;

            onClickEvent(info.event.extendedProps.reservation.id);
        },

        dateClick: (info) => {
            const foundedEvent = findApprovedReservation(
                info.dateStr,
                Number(info.resource!.id)
            );

            new Promise((resolve) => {
                dispatch(fetchObjectById(Number(info.resource?.id)));
                resolve(true);
            }).then(() => {
                if (foundedEvent) return;

                if (authorizedUser?.id !== objectOne?.author.id) return;
                if (formatDate(info.date) < formatDate(new Date())) return;

                onClickDate(formatDate(info.date), Number(info.resource?.id));
            });
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

    const calendarRef = useRef<FullCalendar>(null);
    const calendarContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const objects = getObjectReservations(reservations);
        //FIXME -
        setEvents(
            //@ts-ignore
            reservations.map((reservation) => {
                const status = reservationEventType(reservation?.status as any);
                return {
                    title: reservation.client.fullname,
                    start: reservation.start_date,
                    end: reservation.end_date + "T12:00:01",
                    extendedProps: { reservation: reservation },
                    classNames: status.classNames,
                    textColor: status.textColor,
                    resourceId: reservation.object.id,
                };
            })
        );
        setResources(
            objects.map((object) => ({
                id: object.id,
                title: object.name,
                groupId: object.id,
            })) as ResourceSourceInput
        );

        document.addEventListener("mousemove", async (e) => {
            const x = e.clientX;
            const y = e.clientY;

            const elementUnderMouse = document.elementsFromPoint(x, y);

            const vertLine = elementUnderMouse.find((el) =>
                el.classList.contains("fc-timeline-slot-lane")
            ) as HTMLElement;
            const hozLine = elementUnderMouse.find((el) =>
                el.classList.contains("fc-timeline-lane")
            ) as HTMLElement;

            if (!vertLine || !hozLine) return;

            const plus = stringToHTML(
                `<div class="plus plus-day after:size-4" style="position: absolute; top: ${hozLine.offsetTop}px; left: 0px; width: ${vertLine.offsetWidth}px; height: ${hozLine.offsetHeight}px;"></div>`
            );
            const existingPlus = vertLine.querySelector(".plus") as HTMLElement;

            const isPast = vertLine.classList.contains("fc-day-past");
            const foundedEvent = findApprovedReservation(
                vertLine.dataset.date as string,
                Number(hozLine.dataset.resourceId)
            );
            if (foundedEvent)
                document.querySelectorAll(".plus").forEach((el) => el.remove());

            if (
                elementUnderMouse &&
                (!existingPlus ||
                    (existingPlus &&
                        existingPlus.offsetTop !== hozLine.offsetTop)) &&
                !isPast &&
                !foundedEvent
            ) {
                vertLine.classList.add("relative");
                vertLine.appendChild(plus);
            }

            plus.addEventListener("mouseleave", () => {
                document.querySelectorAll(".plus").forEach((el) => el.remove());
            });
        });
    }, []);

    useEffect(() => {
        const calendarScroll = calendarContainerRef.current?.querySelector(
            ".fc-scroller.fc-scroller-liquid-absolute:has(.fc-day-today)"
        );
        const todayCell = calendarContainerRef.current?.querySelector(
            ".fc-day-today"
        ) as HTMLDivElement;
        if (calendarScroll && todayCell) {
            calendarScroll.scrollLeft = todayCell.offsetLeft - 40;
        }
    }, [calendarRef.current, calendarContainerRef.current]);

    return (
        <>
            <div className="p-5 text-center">
                <div className="mt-2 text-slate-500">
                    {/* BEGIN: Calendar Content */}
                    <div
                        className="full-calendar scheduler"
                        ref={calendarContainerRef}
                    >
                        <FullCalendar {...options} ref={calendarRef} />
                    </div>
                    {/* END: Calendar Content */}
                </div>
            </div>
        </>
    );
}

export default Scheduler;
