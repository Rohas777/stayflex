import _ from "lodash";
import Lucide from "@/components/Base/Lucide";
// import { appleCore } from "@lucide/lab";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import React, { useEffect, useState } from "react";
import { fetchObjectById } from "@/stores/reducers/objects/actions";
import { Navigate, useLocation } from "react-router-dom";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import TinySlider from "@/components/Base/TinySlider";
import object1 from "/src/assets/images/fakers/object-1.jpg";
import object2 from "/src/assets/images/fakers/object-2.jpg";
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
            <div className="grid grid-cols-2 px-5 pt-5 mt-5 intro-y box">
                <div className="col-span-1 pb-14 mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <TinySlider
                        options={{
                            mode: "gallery",
                            controls: true,
                            nav: true,
                            speed: 500,
                        }}
                    >
                        {objectOne?.photos.map((image) => (
                            <div className="h-64 px-2">
                                <div className="h-full overflow-hidden rounded-md image-fit">
                                    <img src={image} />
                                </div>
                            </div>
                        ))}
                    </TinySlider>
                </div>
                <div className="col-span-1 flex flex-col pt-8 mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div className="mb-5 grid grid-cols-2 gap-1">
                        <div className="col-span-1">
                            <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                                <Lucide
                                    icon="DollarSign"
                                    className="w-4 h-4 mr-1"
                                />
                                Аренда:
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                                Цена: {objectOne?.price} ₽
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Предоплата: {objectOne?.prepayment_percentage}%
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Минимальный срок сдачи: {objectOne?.min_ded}
                            </p>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                                <Lucide icon="Home" className="w-4 h-4 mr-1" />
                                Объект:
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                                {objectOne?.apartment.name}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Площадь: {objectOne?.area} м2
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Этаж: {objectOne?.floor}
                            </p>
                            <ul className="text-slate-600 dark:text-slate-300">
                                Спальных мест:
                                <li className="before:content-['•'] before:text-xl/3 before:text-slate-500 before:mr-1">
                                    Взрослых: {objectOne?.adult_places}
                                </li>
                                <li className="before:content-['•'] before:text-xl/3 before:text-slate-500 before:mr-1">
                                    Детских: {objectOne?.child_places}
                                </li>
                            </ul>
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
            <div className="grid grid-cols-2 px-5 pt-5 mt-5 intro-y box">
                <div
                    className="col-span-1 pb-8 mx-6 border-b border-slate-200/60 dark:border-darkmode-400"
                    dangerouslySetInnerHTML={
                        objectOne?.description
                            ? { __html: objectOne?.description }
                            : { __html: "" }
                    }
                ></div>
                <div className="col-span-1 flex flex-col mx-6 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div className="mb-5">
                        <div className="flex items-center mb-2 font-medium text-slate-600 dark:text-slate-300">
                            Удобства:
                        </div>
                        <div className="grid grid-cols-2 gap-1">
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
