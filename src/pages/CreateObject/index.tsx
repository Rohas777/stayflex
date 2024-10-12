import "@/assets/css/vendors/tabulator.css";
import Button from "@/components/Base/Button";
import { useEffect, useRef, createRef, useState } from "react";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, FormCheck } from "@/components/Base/Form";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { ConvenienceCreateType } from "@/stores/reducers/conveniences/types";
import { Link, useLocation } from "react-router-dom";
import TomSelect from "@/components/Base/TomSelect";
import { fetchRegions } from "@/stores/reducers/regions/actions";
import { IRegion } from "@/stores/models/IRegion";
import { schema } from "./schema";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import { fetchConveniences } from "@/stores/reducers/conveniences/actions";
import { fetchPropertyTypes } from "@/stores/reducers/property-types/actions";
import Notification, {
    NotificationElement,
} from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import Toastify from "toastify-js";
import { DropzoneFile } from "dropzone";

window.DateTime = DateTime;

type City = {
    id: number;
    name: string;
};

function Main() {
    const regionsSelector = useAppSelector((state) => state.region);
    const conveniencesSelector = useAppSelector((state) => state.convenience);
    const propertyTypesSelector = useAppSelector((state) => state.propertyType);

    const dispatch = useAppDispatch();

    const [selectedRegion, setSelectedRegion] = useState("-1");
    const [citiesByRegion, setCitiesByRegion] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState("-1");
    const [editorData, setEditorData] = useState("");
    const [selectedConveniences, setSelectedConveniences] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState("-1");

    const [isCreate, setIsCreate] = useState(true);

    const dropzoneValidationRef = useRef<DropzoneElement>();
    const [uploadedGallery, setUploadedGallery] = useState<
        DropzoneFile[] | null
    >(null);
    const [dropzoneError, setDropzoneError] = useState<string | null>(null);
    const [editorError, setEditorError] = useState<string | null>(null);

    const location = useLocation();

    const {
        register,
        trigger,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await trigger();
        if (!editorData) {
            setEditorError("Необходимо обязательно заполнить описание");
        }
        if ((!uploadedGallery && !result) || !uploadedGallery) {
            dropzoneValidationRef.current?.classList.add(
                "border-danger-important"
            );
            setDropzoneError("Обязательно загрузите иконку");
            return;
        }
        if (!result) {
            return;
        }
        const formData = new FormData(event.target);
        // const convenienceData: ConvenienceCreateType = {
        //     convenience_name: JSON.stringify({
        //         name: String(formData.get("name")),
        //     }),
        //     file: uploadedGallery,
        // };
    };
    useEffect(() => {
        const elDropzoneValidationRef = dropzoneValidationRef.current;
        if (elDropzoneValidationRef) {
            elDropzoneValidationRef.dropzone.on("success", (file) => {
                setUploadedGallery(elDropzoneValidationRef.dropzone.files);

                setDropzoneError(null);
                dropzoneValidationRef.current?.classList.remove(
                    "border-danger-important"
                );
            });
            elDropzoneValidationRef.dropzone.on("removedfile", (file) => {
                setUploadedGallery(elDropzoneValidationRef.dropzone.files);
            });
            elDropzoneValidationRef.dropzone.on("error", (file) => {
                elDropzoneValidationRef.dropzone.removeFile(file);
                const rejectGalleryEl = document
                    .querySelectorAll("#reject-gallery-notification")[0]
                    .cloneNode(true) as HTMLElement;
                rejectGalleryEl.classList.remove("hidden");
                Toastify({
                    node: rejectGalleryEl,
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                }).showToast();
            });
        }
        if (location.pathname.replace("/objects/", "") === "create") {
            setIsCreate(true);
        } else {
            setIsCreate(false);
        }
        dispatch(fetchRegions());
        dispatch(fetchConveniences());
        dispatch(fetchPropertyTypes());
    }, []);

    useEffect(() => {
        setEditorError(null);
    }, [editorData]);

    useEffect(() => {
        const regionID = Number(selectedRegion);
        if (regionID) {
            const currentRegion = regionsSelector.regions.find(
                (region) => region.id == regionID
            );
            const cities = currentRegion?.cities;
            setCitiesByRegion(cities || []);
        }
    }, [selectedRegion]);

    // if (regionsSelector.status === Status.LOADING) {
    //     return (
    //         <>
    //             <div className="w-full h-screen relative">
    //                 <div className="absolute inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
    //                     <div className="w-10 h-10">
    //                         <LoadingIcon icon="ball-triangle" />
    //                     </div>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    return (
        <>
            <div className="w-full h-fit relative">
                <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                    <h2 className="mr-auto text-xl font-medium">
                        Добавить объект
                    </h2>
                </div>
                <form className="validate-form" onSubmit={onSubmit}>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Название
                            </h2>
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-name"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Название
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("name")}
                                id="validation-form-name"
                                type="text"
                                name="name"
                                className={clsx({
                                    "border-danger": errors.name,
                                })}
                                defaultValue={undefined}
                                placeholder="Название"
                            />
                            {errors.name && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.name.message === "string" &&
                                        errors.name.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Адрес
                            </h2>
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel className="flex flex-col w-full sm:flex-row">
                                Регион
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>

                            <TomSelect
                                value={selectedRegion}
                                onChange={(e) => {
                                    setSelectedRegion(e.target.value);
                                    setSelectedCity("-1");
                                }}
                                options={{
                                    placeholder: "Выберите регион",
                                }}
                                className="w-full"
                            >
                                {regionsSelector.regions.map((region) => {
                                    if (!region.cities.length) return;
                                    return (
                                        <option
                                            key={region.id}
                                            value={region.id}
                                        >
                                            {region.name}
                                        </option>
                                    );
                                })}
                            </TomSelect>
                        </div>
                        {citiesByRegion.length != 0 && (
                            <div className="input-form mt-3">
                                <FormLabel className="flex flex-col w-full sm:flex-row">
                                    Город
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>

                                <TomSelect
                                    value={selectedCity}
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                    }}
                                    options={{
                                        placeholder: "Выберите город",
                                    }}
                                    className="w-full"
                                >
                                    {citiesByRegion.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </TomSelect>
                            </div>
                        )}
                        {selectedCity != "-1" && (
                            <div className="input-form mt-3">
                                <FormLabel
                                    htmlFor="validation-form-name"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Название
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    {...register("name")}
                                    id="validation-form-name"
                                    type="text"
                                    name="name"
                                    className={clsx({
                                        "border-danger": errors.name,
                                    })}
                                    defaultValue={undefined}
                                    placeholder="Название"
                                />
                                {errors.name && (
                                    <div className="mt-2 text-danger">
                                        {typeof errors.name.message ===
                                            "string" && errors.name.message}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Объект
                            </h2>
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-area"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Площадь
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("area")}
                                id="validation-form-area"
                                type="text"
                                name="area"
                                className={clsx({
                                    "border-danger": errors.area,
                                })}
                                defaultValue={undefined}
                                placeholder="100 м2"
                            />
                            {errors.area && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.area.message === "string" &&
                                        errors.area.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-room_count"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Количество комнат
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("room_count")}
                                id="validation-form-room_count"
                                type="number"
                                name="room_count"
                                className={clsx({
                                    "border-danger": errors.room_count,
                                })}
                                defaultValue={undefined}
                                placeholder="3"
                            />
                            {errors.room_count && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.room_count.message ===
                                        "string" && errors.room_count.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-bed_count"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Спальных мест
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("bed_count")}
                                id="validation-form-bed_count"
                                type="text"
                                name="bed_count"
                                className={clsx({
                                    "border-danger": errors.bed_count,
                                })}
                                defaultValue={undefined}
                                placeholder="3 + 1"
                            />
                            {errors.bed_count && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.bed_count.message ===
                                        "string" && errors.bed_count.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-floor"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Этаж
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("floor")}
                                id="validation-form-floor"
                                type="text"
                                name="floor"
                                className={clsx({
                                    "border-danger": errors.floor,
                                })}
                                defaultValue={undefined}
                                placeholder="4 из 10"
                            />
                            {errors.floor && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.floor.message === "string" &&
                                        errors.floor.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel className="flex flex-col w-full sm:flex-row">
                                Тип недвижимости
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <TomSelect
                                value={selectedPropertyType}
                                onChange={(e) => {
                                    setSelectedPropertyType(e.target.value);
                                }}
                                options={{
                                    placeholder: "Выберите тип недвижимости",
                                }}
                                className="w-full mt-3"
                            >
                                {propertyTypesSelector.propertyTypes.map(
                                    (propertyType) => (
                                        <option
                                            key={propertyType.id}
                                            value={propertyType.id}
                                        >
                                            {propertyType.name}
                                        </option>
                                    )
                                )}
                            </TomSelect>
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center mb-3 intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Описание
                            </h2>
                        </div>
                        <div
                            className={clsx(
                                editorError &&
                                    "border-danger border rounded-md overflow-hidden"
                            )}
                        >
                            <ClassicEditor
                                value={editorData}
                                onChange={setEditorData}
                            />
                        </div>
                        {editorError && (
                            <p className="mt-2 text-danger">{editorError}</p>
                        )}
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Удобства
                            </h2>
                        </div>
                        <TomSelect
                            value={selectedConveniences}
                            onChange={(e) => {
                                setSelectedConveniences(e.target.value);
                            }}
                            options={{
                                placeholder: "Выберите удобства",
                                plugins: {
                                    dropdown_header: {
                                        title: "Удобства",
                                    },
                                },
                                onDelete: () => {
                                    return;
                                },
                            }}
                            className="w-full mt-3"
                            multiple
                        >
                            {conveniencesSelector.conveniences.map(
                                (convenience) => (
                                    <option
                                        key={convenience.id}
                                        value={convenience.id}
                                    >
                                        {convenience.name}
                                    </option>
                                )
                            )}
                        </TomSelect>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Аренда
                            </h2>
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-price"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Цена, ₽
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("price")}
                                id="validation-form-price"
                                type="number"
                                name="price"
                                className={clsx({
                                    "border-danger": errors.price,
                                })}
                                defaultValue={undefined}
                                placeholder="10 000"
                            />
                            {errors.price && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.price.message === "string" &&
                                        errors.price.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-prepayment_percentage"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Предоплата, %
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("prepayment_percentage")}
                                id="validation-form-prepayment_percentage"
                                type="number"
                                name="prepayment_percentage"
                                className={clsx({
                                    "border-danger":
                                        errors.prepayment_percentage,
                                })}
                                defaultValue={undefined}
                                placeholder="50"
                            />
                            {errors.prepayment_percentage && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.prepayment_percentage
                                        .message === "string" &&
                                        errors.prepayment_percentage.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-min_ded"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Минимальный срок сдачи, дни
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("min_ded")}
                                id="validation-form-min_ded"
                                type="number"
                                name="min_ded"
                                className={clsx({
                                    "border-danger": errors.min_ded,
                                })}
                                defaultValue={undefined}
                                placeholder="5"
                            />
                            {errors.min_ded && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.min_ded.message ===
                                        "string" && errors.min_ded.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Галерея
                            </h2>
                        </div>
                        <div className="mt-3">
                            <FormLabel className="flex flex-col w-full sm:flex-row">
                                Фотографии вашего объекта
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>

                            <Dropzone
                                getRef={(el) => {
                                    dropzoneValidationRef.current = el;
                                }}
                                options={{
                                    url: "https://httpbin.org/post",
                                    thumbnailWidth: 150,
                                    maxFilesize: 10,
                                    maxFiles: 2,
                                    resizeHeight: 40,
                                    resizeWidth: 40,
                                    acceptedFiles: "image/*",
                                    clickable: true,
                                    addRemoveLinks: true,
                                }}
                                className="dropzone"
                            >
                                <p className="text-lg font-medium">
                                    Перетащите файлы сюда или кликните для
                                    выбора.
                                </p>
                            </Dropzone>
                            {dropzoneError && (
                                <div className="mt-2 text-danger">
                                    {typeof dropzoneError === "string" &&
                                        dropzoneError}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Каналы продаж
                            </h2>
                        </div>
                        <div className="grid grid-cols-12  mt-3">
                            <FormCheck className="col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-1"
                                    type="checkbox"
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-1">
                                    Авито
                                </FormCheck.Label>
                            </FormCheck>
                            <FormCheck className="col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-3"
                                    type="checkbox"
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-3">
                                    СуточноРу
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                        <div className="grid grid-cols-12 mt-3">
                            <FormCheck className="col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-2"
                                    type="checkbox"
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-2">
                                    Airbnb
                                </FormCheck.Label>
                            </FormCheck>
                            <FormCheck className="col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-4"
                                    type="checkbox"
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-4">
                                    Яндекс.Квартира
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box flex justify-end gap-1">
                        <Link to="/objects">
                            <Button variant="outline-primary">Отмена</Button>
                        </Link>
                        <Button type="submit" variant="primary">
                            {isCreate ? "Добавить" : "Обновить"}
                        </Button>
                    </div>
                </form>
                {/* BEGIN: Success Notification Content */}
                <Notification
                    id="reject-gallery-notification"
                    className="flex hidden"
                >
                    <Lucide icon="XCircle" className="text-danger" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">
                            Вы загрузили максимальное количество изображений
                        </div>
                    </div>
                </Notification>
                {/* END: Success Notification Content */}
                {/* <div className="fixed bottom-0 right-0 bg-slate-50 z-40 py-4 px-6 border-t border-gray-300 w-full">
                    <Button type="submit" variant="primary">
                        {isCreate ? "Добавить" : "Обновить"}
                    </Button>
                </div> */}
            </div>
        </>
    );
}

export default Main;
