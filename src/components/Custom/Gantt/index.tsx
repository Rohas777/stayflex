import { IObjectReservation, IReservation } from "@/stores/models/IReservation";
import { formatDate, getDaysBetweenDates } from "@/utils/customUtils";
import { useEffect, useState } from "react";
import {
    getEarliestDate,
    getMaxConcurrentReservations,
    getObjectReservations,
} from "./utils";

interface Props {
    reservations: IReservation[];
}

function Gantt({ reservations }: Props) {
    const [objectReservations, setObjectReservations] = useState<
        IObjectReservation[]
    >([]);
    const [dates, setDates] = useState<string[]>([]);

    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    useEffect(() => {
        if (!reservations.length) return;
        setObjectReservations(getObjectReservations(reservations));
        setDates(generateDates(getEarliestDate(reservations), 365));
    }, [reservations]);

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

        document.querySelectorAll("[data-days]").forEach((el) => {
            const cell = el as HTMLTableElement;
            cell.style.width = `${
                Number(cell.getAttribute("data-days")) * 40
            }px`;
        });

        document.querySelectorAll("[data-index]").forEach((el) => {
            const cell = el as HTMLTableElement;
            cell.style.top = `${
                Number(cell.getAttribute("data-index")) * 30
            }px`;
        });
    }, [objectReservations]);

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

    if (reservations.length < 1) {
        return <div>Нет броней</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse ">
                <thead>
                    <tr>
                        <th className="border-b p-2 text-left border-r border-slate-200 bg-slate-100 sticky left-0 z-10">
                            Объект
                        </th>
                        {dates.map((date) => (
                            <th
                                key={date}
                                className="border-r border-slate-200 border-b p-2 text-center"
                            >
                                <span className="font-normal">
                                    {dayNames[new Date(date).getDay()]}
                                </span>
                                <br />
                                <span>{new Date(date).getDate()}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {objectReservations.map((object) => {
                        return (
                            <tr key={object.name}>
                                <td className="border-b z-10 p-2 whitespace-nowrap border-r border-slate-200 bg-slate-100 sticky left-0">
                                    {object.name}
                                </td>
                                {dates.map((date) => (
                                    <td
                                        key={date}
                                        className="border-r border-slate-200 border-b"
                                    >
                                        <div
                                            data-max-concurrent-reservations={getMaxConcurrentReservations(
                                                object.reservations as IReservation[]
                                            )}
                                            className="relative w-full"
                                        >
                                            {object.reservations.map(
                                                (reservation, index) => {
                                                    if (
                                                        date ===
                                                        reservation.start_date
                                                    )
                                                        return (
                                                            <div
                                                                key={
                                                                    reservation.id
                                                                }
                                                                data-index={
                                                                    index
                                                                }
                                                                data-days={getDaysBetweenDates(
                                                                    reservation.start_date,
                                                                    reservation.end_date
                                                                )}
                                                                className="absolute h-[28px] whitespace-nowrap bg-blue-500 text-white p-1 rounded-md left-0"
                                                            >
                                                                {
                                                                    reservation
                                                                        .client
                                                                        .fullname
                                                                }
                                                                {object.name}
                                                            </div>
                                                        );
                                                    return;
                                                }
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Gantt;
