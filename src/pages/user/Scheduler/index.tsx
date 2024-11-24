import Scheduler from "@/components/Custom/Scheduler";
import Loader from "@/components/Custom/Loader/Loader";
import OnDevMark from "@/components/Custom/OnDevMark";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchReservations } from "@/stores/reducers/reservations/actions";
import { Status } from "@/stores/reducers/types";
import { useEffect, useState } from "react";

function Main() {
    const dispatch = useAppDispatch();

    const { reservations, statusAll } = useAppSelector(
        (state) => state.reservation
    );

    let tasks = [
        {
            start: new Date(2024, 1, 1),
            end: new Date(2024, 1, 2),
            name: "Idea",
            id: "Task 0",
            type: "task",
            progress: 45,
            isDisabled: true,
            styles: {
                progressColor: "#ffbb54",
                progressSelectedColor: "#ff9e0d",
            },
        },
    ];

    useEffect(() => {
        dispatch(fetchReservations());
    }, []);

    if (statusAll === Status.LOADING) return <Loader />;

    return (
        <>
            <OnDevMark />
            <div className="flex flex-wrap items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Шахматка броней</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center mt-3">
                <div className="flex gap-1">
                    <span className="block size-5 bg-danger rounded-md"></span>{" "}
                    - Отклонена
                </div>
                <div className="flex gap-1">
                    <span className="block size-5 bg-success rounded-md"></span>{" "}
                    - Одобрена
                </div>
                <div className="flex gap-1">
                    <span className="block size-5 bg-warning rounded-md"></span>{" "}
                    - Новая
                </div>
                <div className="flex gap-1">
                    <span className="block size-5 bg-slate-200 rounded-md"></span>{" "}
                    - Завершена
                </div>
            </div>
            <div className="mt-5 intro-y box p-5">
                <Scheduler reservations={reservations} />
            </div>
        </>
    );
}

export default Main;
