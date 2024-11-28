import { IObjectReservation, IReservation } from "@/stores/models/IReservation";
import { formatDate, getDaysBetweenDates } from "@/utils/customUtils";
import { useEffect, useRef, useState } from "react";
import {
    getEarliestDate,
    getMaxConcurrentReservations,
    getObjectReservations,
    sortAndSetOrder,
} from "./utils";
import Tippy from "@/components/Base/Tippy";
import clsx from "clsx";

interface Props {
    reservations: IReservation[];
    onClickEvent: (reservation_id: number) => void;
    onClickDate: (date: string, object_id: number) => void;
    daysRange: number;
}

function Scheduler({
    reservations,
    onClickEvent,
    daysRange,
    onClickDate,
}: Props) {
    const [objectReservations, setObjectReservations] = useState<
        IObjectReservation[]
    >([]);
    const [dates, setDates] = useState<string[]>([]);

    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (!reservations.length) return;
        setObjectReservations(
            sortAndSetOrder(getObjectReservations(reservations))
        );

        const startDate = new Date(getEarliestDate(reservations));
        startDate.setDate(startDate.getDate() - 2);

        setDates(
            generateDates(
                formatDate(startDate),
                daysRange +
                    getDaysBetweenDates(
                        formatDate(startDate),
                        new Date().toISOString()
                    )
            )
        );
    }, [reservations, daysRange]);

    useEffect(() => {
        document
            .querySelectorAll("[data-max-concurrent-reservations]")
            .forEach((el) => {
                const cell = el as HTMLTableElement;

                cell.style.height = `${
                    Number(
                        cell.getAttribute("data-max-concurrent-reservations")
                    ) * 30
                }px`;
            });

        document.querySelectorAll(".side-heading").forEach((el) => {
            const cell = el as HTMLTableElement;
            const tr = cell.parentElement as HTMLTableRowElement;
            cell.style.height = `${tr.offsetHeight}px`;
        });

        document.querySelectorAll("[data-days]").forEach((el) => {
            const cell = el as HTMLTableElement;
            const endDate = cell.getAttribute("data-end");
            const startDate = cell.getAttribute("data-start");
            const lastDate = dates.at(-1);

            if (
                endDate &&
                startDate &&
                lastDate &&
                new Date(lastDate).getTime() < new Date(endDate).getTime()
            ) {
                const days = getDaysBetweenDates(startDate, lastDate);
                cell.style.width = `${days * 40 + 20}px`;
                cell.querySelector("span")?.classList.remove("hidden");
            } else {
                cell.style.width = `${
                    Number(cell.getAttribute("data-days")) * 40 - 20
                }px`;
                cell.querySelector("span")?.classList.add("hidden");
            }
        });

        document.querySelectorAll("[data-index]").forEach((el) => {
            const cell = el as HTMLTableElement;
            cell.style.top = `${
                Number(cell.getAttribute("data-index")) * 30
            }px`;
        });
    }, [objectReservations, daysRange]);

    useEffect(() => {
        if (tableRef.current) {
            const tableContainer = tableRef.current
                .parentElement as HTMLElement;
            const todayCell = document.querySelector(
                "[data-is-today='true']"
            ) as HTMLTableElement;
            tableContainer.scrollLeft = todayCell?.offsetLeft - 40;
        }
    }, [tableRef.current]);

    // Функция для генерации массива дат
    const generateDates = (start: string, days: number): string[] => {
        const startDateObj = new Date(start);
        const dates: string[] = [];

        for (let i = 0; i < days; i++) {
            const newDate = new Date(startDateObj);
            newDate.setDate(startDateObj.getDate() + i); // Добавляем дни
            const formattedDate = newDate.toISOString().split("T")[0]; // Форматируем как "YYYY-MM-DD"
            dates.push(formattedDate);
        }

        return dates;
    };
    const groupDatesByMonth = (dates: string[]): string[][] => {
        const grouped: string[][] = [];
        let currentMonthGroup: string[] = [];

        // Получаем первый месяц из первой даты
        let currentMonth = new Date(dates[0]).getMonth();

        dates.forEach((date) => {
            const dateObj = new Date(date);
            const month = dateObj.getMonth();

            // Если месяц изменился, начинаем новый подмассив
            if (month !== currentMonth) {
                grouped.push(currentMonthGroup);
                currentMonthGroup = [];
                currentMonth = month;
            }

            currentMonthGroup.push(date);
        });

        // Не забываем добавить последнюю группу в конец
        if (currentMonthGroup.length > 0) {
            grouped.push(currentMonthGroup);
        }

        return grouped;
    };

    const findApprovedReservation = (date: string, objectID: number) => {
        const founded = reservations.filter((reservation) => {
            return (
                date >= reservation.start_date && date < reservation.end_date
            );
        });
        let filtered: IReservation | undefined;
        founded.forEach((reservation) => {
            if (reservation.object.id === objectID) {
                filtered = reservation;
                return;
            }
        });

        return filtered;
    };

    if (reservations.length < 1) {
        return <div>Нет броней</div>;
    }

    return (
        <>
            <div className="overflow-x-auto custom-hoz-scrollbar ml-48">
                <table ref={tableRef} className="border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-2 text-left border-r bg-slate-100 dark:bg-darkmode-300 fixed w-48 h-28 z-10 flex items-center -translate-x-full">
                                Объект
                            </th>
                            {groupDatesByMonth(dates).map(
                                (monthGroup, index) => {
                                    const firstDate = new Date(monthGroup[0]);
                                    const monthName = firstDate.toLocaleString(
                                        "ru-RU",
                                        { month: "long" }
                                    ); // Название месяца
                                    const colSpan = monthGroup.length; // Количество дней в этом месяце

                                    return (
                                        <th
                                            key={index}
                                            colSpan={colSpan}
                                            className="border-r border-slate-200 border-b p-2 text-left w-full min-w-[40px] max-w-[40px] h-full max-h-14"
                                        >
                                            <span className="sticky left-2 capitalize">
                                                {monthName}
                                            </span>
                                        </th>
                                    );
                                }
                            )}
                        </tr>
                        <tr className="relative">
                            <th></th>
                            {dates.map((date) => {
                                const isToday =
                                    new Date(date).toDateString() ===
                                    new Date().toDateString();

                                return (
                                    <th
                                        data-is-today={isToday}
                                        key={date}
                                        className={clsx(
                                            "border-r border-t border-slate-200 border-b p-2 text-center w-full min-w-[40px] max-w-[40px] h-full max-h-14",
                                            isToday && "bg-danger/20"
                                        )}
                                    >
                                        <span className="font-normal">
                                            {dayNames[new Date(date).getDay()]}
                                        </span>
                                        <br />
                                        <span>{new Date(date).getDate()}</span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {objectReservations.map((object) => {
                            return (
                                <tr key={object.name}>
                                    <td className="border-b z-10 p-2 whitespace-nowrap border-r bg-slate-100 dark:bg-darkmode-300 fixed w-48 flex items-center -translate-x-full side-heading">
                                        <span className="truncate">
                                            <Tippy
                                                content={object.name}
                                                options={{
                                                    placement: "bottom-start",
                                                }}
                                            >
                                                {object.name}
                                            </Tippy>
                                        </span>
                                    </td>
                                    {dates.map((date) => {
                                        const isToday =
                                            new Date(date).toDateString() ===
                                            new Date().toDateString();
                                        return (
                                            <td
                                                key={date}
                                                className={clsx(
                                                    "border-r border-slate-200 border-b w-[40px] min-w-[40px] max-w-[40px] p-0",
                                                    isToday && "bg-danger/20"
                                                )}
                                            >
                                                <div
                                                    data-max-concurrent-reservations={getMaxConcurrentReservations(
                                                        object.reservations as IReservation[]
                                                    )}
                                                    className="relative w-full plus-day after:size-5"
                                                    onClick={(e) => {
                                                        if (
                                                            e.target !==
                                                            e.currentTarget
                                                        )
                                                            return;
                                                        const foundedReservation =
                                                            findApprovedReservation(
                                                                date,
                                                                object.id
                                                            );
                                                        console.log(
                                                            foundedReservation,
                                                            date
                                                        );
                                                        if (
                                                            foundedReservation &&
                                                            foundedReservation.status ===
                                                                "approved"
                                                        )
                                                            return;
                                                        onClickDate(
                                                            date,
                                                            object.id
                                                        );
                                                    }}
                                                >
                                                    {object.reservations.map(
                                                        (
                                                            reservation,
                                                            index
                                                        ) => {
                                                            if (
                                                                date !==
                                                                reservation.start_date
                                                            )
                                                                return;

                                                            const reservationClasses =
                                                                (
                                                                    data: typeof reservation
                                                                ) => {
                                                                    if (
                                                                        data.status ===
                                                                        "approved"
                                                                    )
                                                                        return "bg-success";
                                                                    if (
                                                                        data.status ===
                                                                        "new"
                                                                    )
                                                                        return "bg-warning";
                                                                    if (
                                                                        data.status ===
                                                                        "rejected"
                                                                    )
                                                                        return "bg-danger";
                                                                    if (
                                                                        data.status ===
                                                                        "completed"
                                                                    )
                                                                        return "bg-slate-200 text-black";
                                                                };

                                                            return (
                                                                <div
                                                                    key={
                                                                        reservation.id
                                                                    }
                                                                    data-index={
                                                                        reservation.order
                                                                    }
                                                                    data-end={
                                                                        reservation.end_date
                                                                    }
                                                                    data-start={
                                                                        reservation.start_date
                                                                    }
                                                                    data-days={getDaysBetweenDates(
                                                                        reservation.start_date,
                                                                        reservation.end_date
                                                                    )}
                                                                    className={`fc-event flex justify-between items-center cursor-pointer z-[100] absolute h-[28px] whitespace-nowrap p-1 rounded-md left-[10px] text-white ${reservationClasses(
                                                                        reservation
                                                                    )}`}
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        onClickEvent(
                                                                            reservation.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <div className="truncate">
                                                                        {
                                                                            reservation
                                                                                .client
                                                                                .fullname
                                                                        }
                                                                    </div>
                                                                    <span className="hidden">
                                                                        &#8594;
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Scheduler;
