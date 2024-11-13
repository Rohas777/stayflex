import Gantt from "@/components/Custom/Gantt";
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
            <div className="mt-5 intro-y box p-5">
                <Gantt reservations={reservations} />
            </div>
        </>
    );
}

export default Main;
