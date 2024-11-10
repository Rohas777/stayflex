import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Link, useParams } from "react-router-dom";
import { fetchObjectsByUser } from "@/stores/reducers/objects/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import Icon from "@/components/Custom/Icon";

function Main() {
    const dispatch = useAppDispatch();
    const { objects, status, error } = useAppSelector((state) => state.object);
    const params = useParams();

    useEffect(() => {
        if (!params.user_id) return;
        dispatch(fetchObjectsByUser(Number(params.user_id)));
    }, []);

    if (status === Status.LOADING) {
        return <Loader />;
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* BEGIN: Users Layout */}
                {objects.map((object) => (
                    <Link
                        to={`/object/${object.id}`}
                        key={object.id}
                        className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box">
                            <div className="p-5">
                                <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img
                                        className="rounded-md"
                                        src={object.photos[0]}
                                    />
                                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                                        <span className="block text-base font-medium">
                                            {object.name}
                                        </span>
                                        <span className="mt-3 text-xs text-white/90">
                                            {object.apartment.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex">
                                        <Icon
                                            icon="Link"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Цена: {object.price}₽/ночь
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="Layers"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Площадь: {object.area} м<sup>2</sup>
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="stairs"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Этаж {object.floor}
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="MapPin"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Адрес: {object.city.region.name},{" "}
                                        {object.city.name}, {object.address}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                                <span className="flex items-center text-primary ml-auto">
                                    <Icon icon="Eye" className="w-4 h-4 mr-1" />
                                    Подробнее
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
                {/* END: Users Layout */}
            </div>
        </>
    );
}

export default Main;
