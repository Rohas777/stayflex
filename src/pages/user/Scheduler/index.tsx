import Scheduler from "@/components/Custom/Scheduler";
import Loader from "@/components/Custom/Loader/Loader";
import OnDevMark from "@/components/Custom/OnDevMark";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
    createReservation,
    deleteReservation,
    fetchReservationById,
    fetchReservations,
    fetchReservationsByObject,
    updateReservation,
} from "@/stores/reducers/reservations/actions";
import { Status } from "@/stores/reducers/types";
import { useEffect, useState } from "react";
import { Dialog, Menu } from "@/components/Base/Headless";
import { clientSlice } from "@/stores/reducers/clients/slice";
import {
    fetchObjectById,
    fetchObjects,
} from "@/stores/reducers/objects/actions";
import Icon from "@/components/Custom/Icon";
import ReservationForm from "./form";
import { stopLoader } from "@/utils/customUtils";
import { objectSlice } from "@/stores/reducers/objects/slice";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import { errorToastSlice } from "@/stores/errorToastSlice";
import Toastify from "toastify-js";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import { IReservation } from "@/stores/models/IReservation";
import Button from "@/components/Base/Button";
import TomSelect from "@/components/Base/CustomTomSelect";
import Notification from "@/components/Base/Notification";

function Main() {
    const [daysRange, setDaysRange] = useState("30");
    const [reservationModal, setReservationModal] = useState(false);
    const [currentReservation, setCurrentReservation] =
        useState<IReservation | null>(null);
    const [currentUnreservedData, setCurrentUnreservedData] = useState<{
        start_date: string;
        objectID: number;
    } | null>(null);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const dispatch = useAppDispatch();

    const clientActions = clientSlice.actions;

    const { reservations, statusAll, error } = useAppSelector(
        (state) => state.reservation
    );

    const onCreate = async (reservationData: ReservationCreateType) => {
        await dispatch(createReservation(reservationData));
    };
    const onUpdate = async (reservationData: ReservationUpdateType) => {
        await dispatch(updateReservation(reservationData));
    };
    const onDelete = async (id: number) => {
        await dispatch(deleteReservation(String(id)));
    };
    const objectActions = objectSlice.actions;
    const reservationState = useAppSelector((state) => state.reservation);
    const reservationActions = reservationSlice.actions;
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
        if (statusAll === Status.ERROR && error) {
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
    }, [
        statusAll,
        error,
        reservationState.statusAll,
        reservationState.error,
        reservationState.statusOne,
    ]);

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
            dispatch(fetchReservations());
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

    useEffect(() => {
        dispatch(fetchObjects());
        dispatch(fetchReservations());
    }, []);

    if (statusAll === Status.LOADING) return <Loader />;

    return (
        <>
            {/* <OnDevMark /> */}
            <div className="flex flex-wrap items-center mt-8 intro-y mx-auto gap-5 gap-y-1">
                <div className="flex flex-wrap items-center intro-y">
                    <h2 className="mr-auto text-lg font-medium">
                        Шахматка броней
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2 items-center mx-auto sm:mx-0 sm:ml-auto">
                    <div className="flex gap-1 items-center text-xs">
                        <span className="block size-3 bg-danger rounded-sm"></span>{" "}
                        - Отклонена
                    </div>
                    <div className="flex gap-1 items-center text-xs">
                        <span className="block size-3 bg-success rounded-sm"></span>{" "}
                        - Одобрена
                    </div>
                    <div className="flex gap-1 items-center text-xs">
                        <span className="block size-3 bg-warning rounded-sm"></span>{" "}
                        - Новая
                    </div>
                    <div className="flex gap-1 items-center text-xs">
                        <span className="block size-3 bg-slate-200 rounded-sm"></span>{" "}
                        - Завершена
                    </div>
                    <TomSelect
                        value={daysRange}
                        onChange={(e) => {
                            setDaysRange(e.target.value);
                        }}
                        options={{
                            controlInput: undefined,
                            searchField: undefined,
                        }}
                        className="w-28"
                    >
                        <option value="30">30 дней</option>
                        <option value="60">60 дней</option>
                        <option value="90">90 дней</option>
                    </TomSelect>
                </div>
            </div>
            <div className="mt-5 intro-y box p-5">
                <Scheduler
                    reservations={reservations}
                    onClickEvent={(reservation_id) => {
                        setCurrentReservation(
                            reservations.find((el) => el.id === reservation_id)!
                        );
                        setReservationModal(true);
                    }}
                    daysRange={Number(daysRange)}
                />
            </div>
            {/* BEGIN: Form Modal */}
            <Dialog
                size="lg"
                id="reservation-form-modal"
                open={reservationModal}
                onClose={(e) => {
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
                        <Icon icon="X" className="w-8 h-8 text-slate-400" />
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
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Icon icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content"></div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
