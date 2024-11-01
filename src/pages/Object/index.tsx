import Lucide from "@/components/Base/Lucide";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import React, { useEffect, useState } from "react";
import { fetchObjectById } from "@/stores/reducers/objects/actions";
import { Navigate, useLocation } from "react-router-dom";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import TinySlider from "@/components/Base/TinySlider";
import { IconType } from "@/vars";

function Main() {
    const { authorizedUser } = useAppSelector((state) => state.user);
    const { objectOne, statusOne, error } = useAppSelector(
        (state) => state.object
    );
    const dispatch = useAppDispatch();

    const location = useLocation();
    useEffect(() => {
        dispatch(
            fetchObjectById(Number(location.pathname.replace("/object/", "")))
        );
    }, []);

    // if (statusOne === Status.ERROR) return <Navigate to="/not-found" />;
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
                            <div className="h-80 xl:h-64 px-2">
                                <div className="h-full overflow-hidden rounded-md image-fit">
                                    <img src={image} />
                                </div>
                            </div>
                        ))}
                    </TinySlider>
                </div>
                <div className="lg:col-span-1 flex flex-col pt-8 lg:pt-2 xl:pt-8 mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="mb-5 col-span-1">
                            <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                                <Lucide icon="Home" className="w-4 h-4 mr-1" />
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
                                <span className="ml-2">Спальных мест:</span>
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
                        <div className="mb-5 col-span-1 xl:mb-0">
                            <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                                <Lucide
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
                                {(objectOne?.price! *
                                    objectOne?.prepayment_percentage!) /
                                    100}{" "}
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
                    <div className="mb-5">
                        <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                            <Lucide icon="MapPin" className="w-4 h-4 mr-1" />
                            Адрес:
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                            {objectOne?.city.region.name},{" "}
                            {objectOne?.city.name}, {objectOne?.address}
                        </p>
                    </div>
                </div>
            </div>
            <div className="lg:hidden flex col-span-1 flex-col box intro-y px-5 py-5 mt-5">
                <div className="mx-6">
                    <div className="flex items-center mb-4 font-medium text-slate-600 dark:text-slate-300">
                        Удобства:
                    </div>
                    <div className="flex flex-wrap gap-5">
                        {objectOne?.conveniences.map((amenity) => (
                            <p className="flex-auto flex items-center text-slate-600 dark:text-slate-300">
                                <Lucide
                                    icon={amenity.icon as IconType}
                                    className="size-5 mr-1"
                                />
                                {amenity.name}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-3 xl:grid-cols-2 px-5 pt-5 mt-5 intro-y box">
                <div
                    className="ck-insert-data lg:col-span-2 xl:col-span-1 pb-8 mx-6" //TODO -
                    dangerouslySetInnerHTML={
                        objectOne?.description
                            ? { __html: objectOne?.description }
                            : { __html: "" }
                    }
                ></div>
                <div className="hidden lg:flex col-span-1 flex-col mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div className="mb-5">
                        <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                            Удобства:
                        </div>
                        <div className="grid  lg:grid-cols-1 xl:grid-cols-2 gap-1">
                            {objectOne?.conveniences.map((amenity) => (
                                <p className="col-span-1 flex items-center text-slate-600 dark:text-slate-300">
                                    <Lucide
                                        icon={amenity.icon as IconType}
                                        className="size-5 mr-1"
                                    />
                                    {amenity.name}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* END: Profile Info */}
        </>
    );
}

export default Main;
