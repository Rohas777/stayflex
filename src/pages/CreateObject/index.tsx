import "@/assets/css/vendors/tabulator.css";
import Button from "@/components/Base/Button";
import { useEffect, useRef, createRef, useState } from "react";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, FormCheck } from "@/components/Base/Form";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TomSelect from "@/components/Base/TomSelect";
import { fetchRegions } from "@/stores/reducers/regions/actions";
import { schema } from "./schema";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import { fetchConveniences } from "@/stores/reducers/conveniences/actions";
import { fetchPropertyTypes } from "@/stores/reducers/property-types/actions";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import Toastify from "toastify-js";
import { ObjectCreateType } from "@/stores/reducers/objects/types";
import { createObject } from "@/stores/reducers/objects/actions";
import CustomTomSelect, {
    TomSelectElement,
} from "@/components/Base/CustomTomSelect";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { DropzoneFile } from "dropzone";
import { objectSlice } from "@/stores/reducers/objects/slice";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

window.DateTime = DateTime;

type City = {
    id: number;
    name: string;
};

type CustomErrors = {
    isValid: boolean;
    region: string | null;
    city: string | null;
    propertyType: string | null;
    conveniences: string | null;
    prepayment: string | null;
    channels: string | null;
    description: string | null;
    gallery: string | null;
};

function Main() {
    const regionsSelector = useAppSelector((state) => state.region);
    const conveniencesSelector = useAppSelector((state) => state.convenience);
    const propertyTypesSelector = useAppSelector((state) => state.propertyType);
    const { isCreated, status, error } = useAppSelector(
        (state) => state.object
    );
    const { resetIsCreated } = objectSlice.actions;

    const dispatch = useAppDispatch();

    const [selectedRegion, setSelectedRegion] = useState("-1");
    const [citiesByRegion, setCitiesByRegion] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState("-1");
    const [editorData, setEditorData] = useState("");
    const [selectedConveniences, setSelectedConveniences] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState("-1");
    const [selectedPrepayment, setSelectedPrepayment] = useState("-1");

    const [isCreate, setIsCreate] = useState(true);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        region: null,
        city: null,
        propertyType: null,
        conveniences: null,
        prepayment: null,
        channels: null,
        description: null,
        gallery: null,
    });

    const dropzoneValidationRef = useRef<DropzoneElement>();
    const regionsValidationRef = useRef<HTMLDivElement>(null);
    const citiesValidationRef = useRef<HTMLDivElement>(null);
    const propertyTypesValidationRef = useRef<HTMLDivElement>(null);
    const convnveniencesValidationRef = useRef<HTMLDivElement>(null);
    const prepaymentValidationRef = useRef<HTMLDivElement>(null);
    const editorValidationRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const addDangerBorder = (ref?: HTMLDivElement | null) => {
        ref?.classList.add("border-danger-important");
    };
    const vaildateWithoutYup = (photos: DropzoneFile[]) => {
        const errors: CustomErrors = {
            isValid: true,
            region: null,
            city: null,
            propertyType: null,
            conveniences: null,
            prepayment: null,
            channels: null,
            description: null,
            gallery: null,
        };
        if (!photos?.length) {
            addDangerBorder(dropzoneValidationRef.current);
            errors.gallery = "Обязательно загрузите фотографии вашего объекта";
        }
        if (selectedRegion == "-1") {
            addDangerBorder(regionsValidationRef.current);
            errors.region = "Обязательно выберите регион";
        }
        if (selectedCity == "-1") {
            addDangerBorder(citiesValidationRef.current);
            errors.city = "Обязательно выберите город";
        }
        if (selectedPropertyType == "-1") {
            addDangerBorder(propertyTypesValidationRef.current);
            errors.propertyType = "Обязательно выберите тип недвижимости";
        }
        if (!selectedConveniences.length) {
            addDangerBorder(convnveniencesValidationRef.current);
            errors.conveniences = "Обязательно выберите хотя бы одно удобство";
        }
        if (selectedPrepayment == "-1") {
            addDangerBorder(prepaymentValidationRef.current);
            errors.prepayment = "Обязательно выберите тип предоплаты";
        }
        if (!editorData) {
            errors.description = "Необходимо обязательно заполнить описание";
        }

        Object.keys(errors).forEach((key) => {
            if (errors[key as keyof CustomErrors] && key != "isValid") {
                errors.isValid = false;
                return;
            }
        });
        setCustomErrors(errors);
        return errors;
    };

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
        startLoader(setIsLoaderOpen);
        const result = await trigger();
        const photos = dropzoneValidationRef.current!.dropzone.files;
        const customResult = vaildateWithoutYup(photos);
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpen);
            return;
        }
        const formData = new FormData(event.target);
        const object: ObjectCreateType = {
            name: String(formData.get("name")),
            city_id: Number(selectedCity),
            address: String(formData.get("address")),
            area: String(formData.get("area")),
            room_count: Number(formData.get("room_count")),
            child_places: Number(formData.get("child_places")),
            adult_places: Number(formData.get("adult_places")),
            floor: String(formData.get("floor")),
            apartment_id: Number(selectedPropertyType),
            description: editorData,
            convenience: selectedConveniences.map(Number),
            price: Number(formData.get("price")),
            prepayment_percentage: Number(selectedPrepayment),
            min_ded: Number(formData.get("min_ded")),
        };
        let formDataTest = new FormData();

        // Добавляем каждый файл в объект FormData
        for (let i = 0; i < photos.length; i++) {
            let file = photos[i];
            formDataTest.append("files[]", file, file.name);
        }
        const objectData = new FormData();
        objectData.append("object_data", JSON.stringify(object));
        photos.forEach((file) => {
            objectData.append("files", file);
        });
        if (isCreate) {
            dispatch(createObject(objectData));
        } else {
            // onUpdate(objectData);
        }
    };
    useEffect(() => {
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
        const elDropzoneValidationRef = dropzoneValidationRef.current;
        if (elDropzoneValidationRef) {
            elDropzoneValidationRef.dropzone.on("addedfile", (file) => {
                setCustomErrors((prev) => ({ ...prev, gallery: null }));
                dropzoneValidationRef.current?.classList.remove(
                    "border-danger-important"
                );
            });
            elDropzoneValidationRef.dropzone.on("removedfile", (file) => {});
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
    }, [dropzoneValidationRef.current?.dropzone.files]);

    useEffect(() => {
        if (editorData) {
            setCustomErrors((prev) => ({ ...prev, description: null }));
        }
    }, [editorData]);
    useEffect(() => {
        if (status === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            console.log(error);
        }
        if (isCreated) {
            const successEl = document
                .querySelectorAll("#create-success-notification")[0]
                .cloneNode(true) as HTMLElement;
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
            dispatch(resetIsCreated());
            navigate("/objects");
        }
    }, [isCreated, status]);

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

    if (regionsSelector.status === Status.LOADING && !isLoaderOpen) {
        return (
            <>
                <div className="w-full h-screen relative">
                    <div className="absolute inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
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
                            <div
                                ref={regionsValidationRef}
                                className={clsx(
                                    "border rounded-md border-transparent",
                                    {
                                        "border-danger-important":
                                            customErrors.region,
                                    }
                                )}
                            >
                                <TomSelect
                                    value={selectedRegion}
                                    onChange={(e) => {
                                        setSelectedRegion(e.target.value);
                                        setSelectedCity("-1");
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            region: null,
                                        }));
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
                            {customErrors.region && (
                                <div className="mt-2 text-danger">
                                    {typeof customErrors.region === "string" &&
                                        customErrors.region}
                                </div>
                            )}
                        </div>
                        {citiesByRegion.length != 0 && (
                            <div className="input-form mt-3">
                                <FormLabel className="flex flex-col w-full sm:flex-row">
                                    Город
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <div
                                    ref={citiesValidationRef}
                                    className={clsx(
                                        "border rounded-md border-transparent",
                                        {
                                            "border-danger-important":
                                                customErrors.city,
                                        }
                                    )}
                                >
                                    <TomSelect
                                        value={selectedCity}
                                        onChange={(e) => {
                                            setSelectedCity(e.target.value);
                                            setCustomErrors((prev) => ({
                                                ...prev,
                                                city: null,
                                            }));
                                        }}
                                        options={{
                                            placeholder: "Выберите город",
                                        }}
                                        className="w-full"
                                    >
                                        {citiesByRegion.map((city) => (
                                            <option
                                                key={city.id}
                                                value={city.id}
                                            >
                                                {city.name}
                                            </option>
                                        ))}
                                    </TomSelect>
                                </div>
                                {customErrors.city && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.city ===
                                            "string" && customErrors.city}
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedCity != "-1" && (
                            <div className="input-form mt-3">
                                <FormLabel
                                    htmlFor="validation-form-address"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Адрес
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    {...register("address")}
                                    id="validation-form-address"
                                    type="text"
                                    name="address"
                                    className={clsx({
                                        "border-danger": errors.address,
                                    })}
                                    defaultValue={undefined}
                                    placeholder="Улица, дом, квартира"
                                />
                                {errors.address && (
                                    <div className="mt-2 text-danger">
                                        {typeof errors.address.message ===
                                            "string" && errors.address.message}
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
                        <div className="mt-3 flex flex-col gap-5 w-full sm:flex-row">
                            <div className="input-form flex-1">
                                <FormLabel
                                    htmlFor="validation-form-adult_places"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Взрослых спальных мест
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    {...register("adult_places")}
                                    id="validation-form-adult_places"
                                    type="number"
                                    name="adult_places"
                                    className={clsx({
                                        "border-danger": errors.adult_places,
                                    })}
                                    defaultValue={undefined}
                                    placeholder="3"
                                />
                                {errors.adult_places && (
                                    <div className="mt-2 text-danger">
                                        {typeof errors.adult_places.message ===
                                            "string" &&
                                            errors.adult_places.message}
                                    </div>
                                )}
                            </div>
                            <div className="input-form flex-1">
                                <FormLabel
                                    htmlFor="validation-form-child_places"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Детских спальных мест
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    {...register("child_places")}
                                    id="validation-form-child_places"
                                    type="number"
                                    name="child_places"
                                    className={clsx({
                                        "border-danger": errors.child_places,
                                    })}
                                    defaultValue={undefined}
                                    placeholder="1"
                                />
                                {errors.child_places && (
                                    <div className="mt-2 text-danger">
                                        {typeof errors.child_places.message ===
                                            "string" &&
                                            errors.child_places.message}
                                    </div>
                                )}
                            </div>
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
                            <div
                                ref={propertyTypesValidationRef}
                                className={clsx(
                                    "border rounded-md border-transparent",
                                    {
                                        "border-danger-important":
                                            customErrors.propertyType,
                                    }
                                )}
                            >
                                <TomSelect
                                    value={selectedPropertyType}
                                    onChange={(e) => {
                                        setSelectedPropertyType(e.target.value);
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            propertyType: null,
                                        }));
                                    }}
                                    options={{
                                        placeholder:
                                            "Выберите тип недвижимости",
                                    }}
                                    className="w-full"
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
                            {customErrors.propertyType && (
                                <div className="mt-2 text-danger">
                                    {typeof customErrors.propertyType ===
                                        "string" && customErrors.propertyType}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center mb-3 intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Описание
                            </h2>
                        </div>
                        <div
                            ref={editorValidationRef}
                            className={clsx(
                                "border rounded-sm border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.description,
                                }
                            )}
                        >
                            <ClassicEditor
                                value={editorData}
                                onChange={setEditorData}
                            />
                        </div>
                        {customErrors.description && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.description === "string" &&
                                    customErrors.description}
                            </div>
                        )}
                    </div>
                    <div className="p-5 mt-5 intro-y box">
                        <div className="flex flex-col items-center intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Удобства
                            </h2>
                        </div>
                        <div
                            ref={convnveniencesValidationRef}
                            className={clsx(
                                "mt-3 border rounded-md border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.conveniences,
                                }
                            )}
                        >
                            <TomSelect
                                value={selectedConveniences}
                                onChange={(e) => {
                                    setSelectedConveniences(e.target.value);

                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        conveniences: null,
                                    }));
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
                                className="w-full"
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
                        {customErrors.conveniences && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.conveniences ===
                                    "string" && customErrors.conveniences}
                            </div>
                        )}
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
                            <FormLabel className="flex flex-col w-full sm:flex-row">
                                Предоплата, %
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <div
                                ref={prepaymentValidationRef}
                                className={clsx(
                                    "border rounded-md border-transparent",
                                    {
                                        "border-danger-important":
                                            customErrors.prepayment,
                                    }
                                )}
                            >
                                <CustomTomSelect
                                    value={selectedPrepayment}
                                    onChange={(e) => {
                                        setSelectedPrepayment(e.target.value);
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            prepayment: null,
                                        }));
                                    }}
                                    options={{
                                        placeholder:
                                            "Выберите процент предоплаты",
                                    }}
                                    className="w-full"
                                >
                                    <option value="0">Без предоплаты</option>
                                    <option value="50">50%</option>
                                    <option value="100">100%</option>
                                </CustomTomSelect>
                            </div>
                            {customErrors.prepayment && (
                                <div className="mt-2 text-danger">
                                    {typeof customErrors.prepayment ===
                                        "string" && customErrors.prepayment}
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
                                    customErrors.gallery &&
                                        el.classList.add(
                                            "border-danger-important"
                                        );
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
                            {customErrors.gallery && (
                                <div className="mt-2 text-danger">
                                    {typeof customErrors.gallery === "string" &&
                                        customErrors.gallery}
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
                {/* BEGIN: Success Notification Content */}
                <Notification
                    id="create-success-notification"
                    className="flex hidden"
                >
                    <Lucide icon="CheckCircle" className="text-success" />
                    <div className="ml-4 mr-4">
                        <div className="font-medium">
                            Объект успешно добавлен
                        </div>
                    </div>
                </Notification>
                {/* END: Success Notification Content */}
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
