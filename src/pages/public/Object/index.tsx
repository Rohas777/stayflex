import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import React, { useEffect, useState } from "react";
import { fetchObjectById } from "@/stores/reducers/objects/actions";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import TinySlider from "@/components/Base/TinySlider";
import { IconType } from "@/vars";
import Button from "@/components/Base/Button";
import ReservationForm from "./form";
import { Dialog } from "@/components/Base/Headless";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { stopLoader } from "@/utils/customUtils";
import Toastify from "toastify-js";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import Notification from "@/components/Base/Notification";
import Icon from "@/components/Custom/Icon";
import { ReservationClientCreateType } from "@/stores/reducers/reservations/types";
import { createClientReservation } from "@/stores/reducers/reservations/actions";

function Main() {
    const [reservationModal, setReservationModal] = useState(false);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const { objectOne, statusOne, error } = useAppSelector(
        (state) => state.object
    );
    const reservationState = useAppSelector((state) => state.reservation);
    const reservationActions = reservationSlice.actions;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    useEffect(() => {
        dispatch(
            fetchObjectById(Number(location.pathname.replace("/object/", "")))
        );
    }, []);

    const onCreate = async (reservationData: ReservationClientCreateType) => {
        await dispatch(createClientReservation(reservationData));
    };
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
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

            dispatch(reservationActions.resetStatusOne());
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
        reservationState.statusAll,
        reservationState.error,
        reservationState.statusOne,
    ]);

    useEffect(() => {
        if (reservationState.isCreated) {
            setReservationModal(false);
            dispatch(
                fetchObjectById(
                    Number(location.pathname.replace("/object/", ""))
                )
            );
            navigate("/reservation-success");
            stopLoader(setIsLoaderOpen);
            dispatch(reservationActions.resetIsCreated());
        }
    }, [reservationState.isCreated]);

    if (statusOne === Status.ERROR) return <Navigate to="/not-found" />;
    if (statusOne === Status.LOADING) return <Loader />;

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Объект - {objectOne?.name}
                </h2>
            </div>
            {/* BEGIN: Profile Info */}
            <div className="grid lg:grid-cols-3 xl:grid-cols-2 px-5 pt-5 mt-5 intro-y box">
                <div className="lg:col-span-2 xl:col-span-1 pb-14 mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <TinySlider
                        options={{
                            mode: "gallery",
                            controls: true,
                            nav: true,
                            speed: 500,
                        }}
                    >
                        {objectOne?.photos.map((image) => (
                            <div key={image} className="aspect-video h-96 px-2">
                                <div className="h-full overflow-hidden rounded-md image-fit">
                                    <img src={image} />
                                </div>
                            </div>
                        ))}
                    </TinySlider>
                </div>
                <div className="lg:col-span-1 flex flex-col pt-8 lg:pt-2 xl:pt-8 mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div className="mb-5">
                        <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                            <Icon icon="MapPin" className="w-4 h-4 mr-1" />
                            Адрес:
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            {objectOne?.city.region.name},{" "}
                            {objectOne?.city.name}, {objectOne?.address}
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="mb-5 col-span-1">
                            <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                                <Icon icon="Home" className="w-4 h-4 mr-1" />
                                Объект:
                            </div>
                            <p className="flex items-end text-slate-600 dark:text-slate-300">
                                <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                    Тип:
                                </span>{" "}
                                {objectOne?.apartment.name}
                            </p>
                            <p className="flex items-end text-slate-600 dark:text-slate-300">
                                <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                    Комнат:
                                </span>{" "}
                                {objectOne?.room_count}
                            </p>
                            <p className="flex items-end text-slate-600 dark:text-slate-300">
                                <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                    Площадь:
                                </span>{" "}
                                {objectOne?.area} м2
                            </p>
                            <p className="flex items-end text-slate-600 dark:text-slate-300">
                                <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                    Этаж:
                                </span>{" "}
                                {objectOne?.floor}
                            </p>
                            <ul className="text-slate-600 dark:text-slate-300">
                                <div className="flex items-center my-2 font-medium text-slate-600 dark:text-slate-300">
                                    <Icon icon="Bed" className="w-4 h-4 mr-1" />
                                    Спальных мест:
                                </div>
                                <li className="flex items-end">
                                    <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                        Взрослых:
                                    </span>{" "}
                                    {objectOne?.adult_places}
                                </li>
                                <li className="flex items-end">
                                    <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                        Детских:
                                    </span>{" "}
                                    {objectOne?.child_places}
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-between h-full mb-5 col-span-1 xl:mb-0">
                            <div>
                                <div className="flex items-center mb-2 font-medium  text-slate-600 dark:text-slate-300">
                                    <Icon
                                        icon="DollarSign"
                                        className="w-4 h-4 mr-1"
                                    />
                                    Аренда:
                                </div>
                                <p className="flex items-end text-slate-600 dark:text-slate-300">
                                    <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                        Цена:
                                    </span>{" "}
                                    {objectOne?.price} ₽
                                </p>
                                <p className="flex items-end text-slate-600 dark:text-slate-300">
                                    <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                        Предоплата:
                                    </span>{" "}
                                    {Math.round(
                                        (objectOne?.price! *
                                            objectOne?.prepayment_percentage!) /
                                            100
                                    )}{" "}
                                    ₽
                                </p>
                                <p className="flex items-end text-slate-600 dark:text-slate-300">
                                    <span className="flex flex-grow whitespace-nowrap after:content-[''] after:mb-1.5 after:mx-1 after:w-full after:border-b after:border-slate-300 after:border-dotted">
                                        Мин. срок сдачи:
                                    </span>{" "}
                                    {objectOne?.min_ded}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse xl:flex-row px-5 pt-10 mt-5 intro-y box">
                <div className="flex-1">
                    <div className="mx-6">
                        <div className="flex items-center mb-4 text-lg font-medium text-slate-600 dark:text-slate-300">
                            Удобства:
                        </div>
                        <div className="flex flex-wrap gap-5 gap-y-2">
                            {objectOne?.conveniences.map((amenity) => (
                                <p className="flex items-center text-slate-600 dark:text-slate-300">
                                    <Icon
                                        icon={amenity.icon as IconType}
                                        className="size-5 mr-1"
                                    />
                                    {amenity.name}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="mx-6 mt-4">
                        <div className="flex items-center mb-4 text-lg font-medium text-slate-600 dark:text-slate-300">
                            Описание:
                        </div>

                        <div
                            className="ck-insert-data pb-8 mt-2" //TODO -
                            dangerouslySetInnerHTML={
                                objectOne?.description
                                    ? { __html: objectOne?.description }
                                    : { __html: "" }
                            }
                        ></div>
                    </div>
                </div>

                {objectOne && (
                    <div className="flex-1">
                        <ReservationForm
                            object={objectOne!}
                            onCreate={onCreate}
                            setIsLoaderOpen={setIsLoaderOpen}
                            isLoaderOpen={isLoaderOpen}
                        />
                    </div>
                )}
            </div>
            {/* END: Profile Info */}

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
