import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchObjectsByUser } from "@/stores/reducers/objects/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import Icon from "@/components/Custom/Icon";
import { fetchHashtags } from "@/stores/reducers/hashtags/actions";
import Button from "@/components/Base/Button";
import Tippy from "@/components/Base/Tippy";

function Main() {
    const dispatch = useAppDispatch();
    const { objects, status, error } = useAppSelector((state) => state.object);
    const hashtagsState = useAppSelector((state) => state.hashtag);
    const params = useParams();
    const location = useLocation();

    const hashtagsIds = location.search
        .replace("?hashtags=", "")
        .split(",")
        .map((hashtag) => Number(hashtag));

    useEffect(() => {
        if (!params.user_id) return;

        dispatch(
            fetchObjectsByUser({
                id: Number(params.user_id),
                hashtags: location.search ? hashtagsIds : undefined,
            })
        );
        dispatch(fetchHashtags());
    }, [location.search]);

    if (status === Status.LOADING) {
        return <Loader />;
    }

    return (
        <>
            {/* BEGIN: Profile Info */}
            <div className="px-5 pt-5 mt-5 intro-y box">
                <div className="flex justify-center pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                    {!!objects.length ? (
                        <div className="flex flex-col items-center mt-4">
                            <div className="flex items-center justify-center sm:whitespace-normal font-medium">
                                {objects[0]?.author?.fullname}
                            </div>
                            <Link
                                to={`mailto:${objects[0]?.author?.mail}`}
                                className="flex items-center justify-center mt-3 truncate sm:whitespace-normal"
                            >
                                <Icon icon="Mail" className="w-4 h-4 mr-2" />
                                {objects[0]?.author?.mail}
                            </Link>
                            <Link
                                to={`tel:${objects[0]?.author?.phone}`}
                                className="flex items-center justify-center mt-3 truncate sm:whitespace-normal"
                            >
                                <Icon icon="Phone" className="w-4 h-4 mr-2" />{" "}
                                {objects[0]?.author?.phone}
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center my-4">
                            <div className="flex items-center justify-center sm:whitespace-normal font-medium text-xl">
                                У этого пользователя нет объектов
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {location.search && (
                <div className="p-5 mt-5 intro-y box flex items-center">
                    <Link to={location.pathname}>
                        <Tippy content="Сбросить">
                            <Icon
                                icon="RefreshCwOff"
                                className="size-6 mr-2 hover:text-primary"
                            />
                        </Tippy>
                    </Link>
                    <div>
                        Применённые хэштеги:{" "}
                        {hashtagsState.hashtags.map((hashtag) => {
                            if (!hashtagsIds.includes(hashtag.id)) return;
                            return (
                                <span
                                    key={hashtag.id}
                                    className="inline-flex items-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-darkmode-400 px-2 rounded"
                                >
                                    {hashtag.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* END: Profile Info */}
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
                                        Площадь: {object.area} м²
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="Bed"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Мест:{" "}
                                        {object.adult_places +
                                            object.child_places}
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="houses"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Комнат: {object.room_count}
                                    </div>
                                    <div className="flex mt-2">
                                        <Icon
                                            icon="MapPin"
                                            className="size-5    mr-2"
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
