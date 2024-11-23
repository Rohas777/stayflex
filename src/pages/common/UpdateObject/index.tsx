import "@/assets/css/vendors/tabulator.css";
import "@/assets/css/vendors/dropzone.css";
import Button from "@/components/Base/Button";
import { useEffect, useRef, createRef, useState } from "react";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    FormLabel,
    FormInput,
    FormCheck,
    FormTextarea,
} from "@/components/Base/Form";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TomSelect from "@/components/Base/TomSelect";
import { fetchRegions } from "@/stores/reducers/regions/actions";
import { schema } from "./schema";
// import { ClassicEditor } from "@/components/Base/Ckeditor";
import { fetchAmenities } from "@/stores/reducers/amenities/actions";
import { fetchPropertyTypes } from "@/stores/reducers/property-types/actions";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import Toastify from "toastify-js";
import {
    ObjectCreateType,
    ObjectUpdateType,
} from "@/stores/reducers/objects/types";
import {
    createObject,
    fetchObjectById,
    updateObject,
} from "@/stores/reducers/objects/actions";
import CustomTomSelect, {
    TomSelectElement,
} from "@/components/Base/CustomTomSelect";
import LoadingIcon from "@/components/Base/LoadingIcon";
import {
    ImageDropzoneFile,
    resizeDropzoneFiles,
    startLoader,
    stopLoader,
} from "@/utils/customUtils";
import { DropzoneFile } from "dropzone";
import { objectSlice } from "@/stores/reducers/objects/slice";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import Tippy from "@/components/Base/Tippy";
import ImageZoom from "@/components/Base/ImageZoom";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { amenitySlice } from "@/stores/reducers/amenities/slice";
import { propertyTypeSlice } from "@/stores/reducers/property-types/slice";
import Loader from "@/components/Custom/Loader/Loader";
import { IObject } from "@/stores/models/IObject";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import { CKEditorClassic } from "@/components/Custom/CKEditor";

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
    amenities: string | null;
    prepayment: string | null;
    channels: string | null;
    description: string | null;
    gallery: string | null;
};

function Main() {
    const maxFilesize = 1.5;
    const dispatch = useAppDispatch();
    const regionsState = useAppSelector((state) => state.region);
    const amenitiesState = useAppSelector((state) => state.amenity);
    const propertyTypesState = useAppSelector((state) => state.propertyType);
    const { isUpdated, status, error } = useAppSelector(
        (state) => state.object
    );
    const { authorizedUser } = useAppSelector((state) => state.user);
    const objectState = useAppSelector((state) => state.object);
    const amenityActions = amenitySlice.actions;
    const propertyTypeActions = propertyTypeSlice.actions;
    const objectActions = objectSlice.actions;
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
        if (status === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpen);

            dispatch(objectActions.resetStatus());
        }
        if (amenitiesState.status === Status.ERROR && amenitiesState.error) {
            dispatch(
                setErrorToast({
                    message: amenitiesState.error,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(amenityActions.resetStatus());
        }
        if (
            propertyTypesState.status === Status.ERROR &&
            propertyTypesState.error
        ) {
            dispatch(
                setErrorToast({
                    message: propertyTypesState.error,
                    isError: true,
                })
            );
            stopLoader(setIsLoaderOpen);

            dispatch(propertyTypeActions.resetStatus());
        }
    }, [
        status,
        error,
        regionsState.status,
        regionsState.error,
        amenitiesState.status,
        amenitiesState.error,
        propertyTypesState.status,
        propertyTypesState.error,
    ]);

    const [selectedRegion, setSelectedRegion] = useState("-1");
    const [citiesByRegion, setCitiesByRegion] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState("-1");
    const [editorData, setEditorData] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState("-1");
    const [selectedPrepayment, setSelectedPrepayment] = useState("-1");
    const [isObjectActivated, setIsObjectActivated] = useState(true);
    const [photos, setPhotos] = useState<string[]>([]);
    const [maxFiles, setMaxFiles] = useState(10);
    const [data, setData] = useState<IObject | null>(null);

    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        region: null,
        city: null,
        propertyType: null,
        amenities: null,
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
    const vaildateWithoutYup = (gallery: DropzoneFile[]) => {
        const errors: CustomErrors = {
            isValid: true,
            region: null,
            city: null,
            propertyType: null,
            amenities: null,
            prepayment: null,
            channels: null,
            description: null,
            gallery: null,
        };
        if (!gallery?.length && !photos?.length) {
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
        if (!selectedAmenities.length) {
            addDangerBorder(convnveniencesValidationRef.current);
            errors.amenities = "Обязательно выберите хотя бы одно удобство";
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
        const gallery = dropzoneValidationRef.current!.dropzone.files;
        startLoader(setIsLoaderOpen);
        const resizedFiles = await resizeDropzoneFiles(
            gallery as ImageDropzoneFile[],
            dropzoneValidationRef
        );
        const result = await trigger();
        const customResult = vaildateWithoutYup(gallery);
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpen);
            return;
        }
        const formData = new FormData(event.target);
        const object: ObjectUpdateType = {
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
            id: Number(objectState.objectOne?.id),
            price: Number(formData.get("price")),
            prepayment_percentage: Number(selectedPrepayment),
            min_ded: Number(formData.get("min_ded")),
            active: isObjectActivated,
            letter: String(formData.get("letter")),
        };
        function filterDeletedPhotos(remaining: string[], initial: string[]) {
            const dictFromReamining = new Map();
            remaining.forEach((item, index) => {
                dictFromReamining.set(item, index);
            });
            const filteredInitial = initial.filter(
                (item) => !dictFromReamining.has(item)
            );

            return filteredInitial;
        }

        const convenience_and_removed_photos = {
            convenience: selectedAmenities.map(Number),
            removed_photos: filterDeletedPhotos(
                photos,
                objectState.objectOne?.photos!
            ),
        };

        const objectData = new FormData();
        objectData.append(
            "convenience_and_removed_photos",
            JSON.stringify(convenience_and_removed_photos)
        );
        objectData.append("update_object", JSON.stringify(object));
        resizedFiles.forEach((file) => {
            objectData.append("files", file);
        });
        dispatch(updateObject(objectData));
    };
    useEffect(() => {
        dispatch(
            fetchObjectById(
                Number(
                    location.pathname
                        .replace("/admin", "")
                        .replace("/objects/update/", "")
                )
            )
        );
        dispatch(fetchRegions());
        dispatch(fetchAmenities());
        dispatch(fetchPropertyTypes());
    }, []);

    useEffect(() => {
        if (objectState.statusOne !== Status.SUCCESS || !objectState.objectOne)
            return;
        setSelectedRegion(String(objectState.objectOne.city.region.id));
        setSelectedCity(String(objectState.objectOne.city.id));
        setSelectedPropertyType(String(objectState.objectOne.apartment.id));
        setSelectedAmenities(
            objectState.objectOne.conveniences.map((amenity) =>
                String(amenity.id)
            )!
        );
        setSelectedPrepayment(
            String(objectState.objectOne.prepayment_percentage)
        );
        setEditorData(String(objectState.objectOne.description));
        setIsObjectActivated(objectState.objectOne.active);
        setPhotos(objectState.objectOne.photos);
        setMaxFiles(10 - objectState.objectOne.photos.length!);
        setData(objectState.objectOne!);
    }, [objectState.statusOne, objectState.objectOne]);

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
        if (objectState.statusOne === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            console.log(error);
        }
        if (isUpdated) {
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
            dispatch(objectActions.resetIsUpdated());
            navigate(authorizedUser?.is_admin ? "/admin/objects" : "/objects");
        }
    }, [isUpdated, objectState.statusOne, error]);

    useEffect(() => {
        const regionID = Number(
            objectState.objectOne?.city.region.id || selectedRegion
        );
        if (regionID && regionsState.status === Status.SUCCESS) {
            const currentRegion = regionsState.regions.find(
                (region) => region.id == regionID
            );
            const cities = currentRegion?.cities;
            setCitiesByRegion(cities || []);
        }
    }, [selectedRegion, regionsState.status, regionsState.regions]);

    useEffect(() => {}, [objectState.statusOne]);

    if (
        (regionsState.status === Status.LOADING ||
            (objectState.statusOne === Status.LOADING &&
                !objectState.objectOne)) &&
        !isLoaderOpen
    ) {
        return <Loader />;
    }

    if (!data) return <Loader />;

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="w-full h-fit relative">
                <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                    <h2 className="mr-auto text-xl font-medium">
                        Редактировать объект
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
                                defaultValue={data.name}
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
                                    {regionsState.regions.map((region) => {
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
                        {citiesByRegion.length != 0 &&
                            objectState.objectOne && (
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
                                    defaultValue={
                                        objectState.objectOne
                                            ? objectState.objectOne.address
                                            : undefined
                                    }
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
                                Площадь, м2
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("area")}
                                id="validation-form-area"
                                type="number"
                                name="area"
                                className={clsx({
                                    "border-danger": errors.area,
                                })}
                                defaultValue={
                                    objectState.objectOne
                                        ? Number(data.area)
                                        : undefined
                                }
                                placeholder="100"
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
                                defaultValue={data.room_count}
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
                                    defaultValue={data.adult_places}
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
                                    defaultValue={data.child_places}
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
                                defaultValue={data.floor}
                                placeholder="4"
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
                                    {propertyTypesState.propertyTypes.map(
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
                                        customErrors.amenities,
                                }
                            )}
                        >
                            <TomSelect
                                value={selectedAmenities}
                                onChange={(e) => {
                                    setSelectedAmenities(e.target.value);

                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        amenities: null,
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
                                {amenitiesState.amenities.map((amenity) => (
                                    <option key={amenity.id} value={amenity.id}>
                                        {amenity.name}
                                    </option>
                                ))}
                            </TomSelect>
                        </div>
                        {customErrors.amenities && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.amenities === "string" &&
                                    customErrors.amenities}
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
                                defaultValue={data.price}
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
                                defaultValue={data.min_ded}
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
                        <div className="my-3">
                            {photos.map((photo) => (
                                <div
                                    key={photo}
                                    className="float-left size-20 mr-3 relative group"
                                >
                                    <Lucide
                                        icon="X"
                                        className="absolute transition z-10 -top-2 -right-2 p-1 cursor-pointer rounded-full bg-danger text-white group-hover:opacity-100 opacity-0"
                                        onClick={() => {
                                            setPhotos(
                                                photos.filter(
                                                    (item) => item !== photo
                                                )
                                            );
                                        }}
                                    />
                                    <div className="size-full rounded-md image-fit cursor-zoom-in overflow-hidden">
                                        <ImageZoom
                                            src={photo}
                                            className="size-full hover:scale-120"
                                        />
                                    </div>
                                </div>
                            ))}
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
                                    maxFilesize: maxFilesize,
                                    maxFiles: maxFiles,
                                    acceptedFiles: "image/*",
                                    clickable: true,
                                    addRemoveLinks: true,
                                    dictRemoveFile: "",
                                    dictCancelUpload: "",
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
                        <div className="flex flex-col items-center mb-3 intro-y sm:flex-row">
                            <h2 className="mr-auto text-lg font-medium">
                                Дополнительная информация
                            </h2>
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-description"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Описание
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
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
                                <CKEditorClassic
                                    id="validation-form-description"
                                    editorData={editorData}
                                    onChange={(event, editor) => {
                                        setEditorData(editor.getData());
                                    }}
                                />
                            </div>
                            {customErrors.description && (
                                <div className="mt-2 text-danger">
                                    {typeof customErrors.description ===
                                        "string" && customErrors.description}
                                </div>
                            )}
                        </div>
                        <div className="input-form mt-3">
                            <FormLabel
                                htmlFor="validation-form-letter"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Служебная информация
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormTextarea
                                {...register("letter")}
                                id="validation-form-letter"
                                name="letter"
                                className={clsx({
                                    "border-danger": errors.letter,
                                })}
                                defaultValue={data.letter}
                                placeholder="Ключи под ковриком"
                            ></FormTextarea>
                            {errors.letter && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.letter.message ===
                                        "string" && errors.letter.message}
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
                        <div className="grid grid-cols-12 gap-3  mt-3">
                            <FormCheck className="col-span-12 sm:col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-1"
                                    type="checkbox"
                                    checked
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-1">
                                    Авито
                                </FormCheck.Label>
                            </FormCheck>
                            <FormCheck className="col-span-12 sm:col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-3"
                                    type="checkbox"
                                    checked
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-3">
                                    СуточноРу
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                        <div className="grid grid-cols-12 gap-3 mt-3">
                            <FormCheck className="col-span-12 sm:col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-2"
                                    type="checkbox"
                                    checked
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-2">
                                    Airbnb
                                </FormCheck.Label>
                            </FormCheck>
                            <FormCheck className="col-span-12 sm:col-span-3">
                                <FormCheck.Input
                                    id="checkbox-switch-4"
                                    type="checkbox"
                                    checked
                                    value=""
                                    className="size-6 mr-2"
                                />
                                <FormCheck.Label htmlFor="checkbox-switch-4">
                                    Яндекс.Квартира
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                    </div>
                    <div className="p-5 mt-5 intro-y box flex flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <label
                                onChange={(e) =>
                                    setIsObjectActivated(
                                        (e.target as HTMLInputElement).checked
                                    )
                                }
                                className="inline-flex items-center cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={isObjectActivated}
                                    className="sr-only peer"
                                />
                                <div className="mr-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                Активировать сразу?
                            </label>
                            <Tippy content="Определяет будет ли объект отображаться в виджете">
                                <Lucide icon="Info" className="cursor-help" />
                            </Tippy>
                        </div>
                        <div className="ml-auto flex gap-1">
                            <Link to="/objects">
                                <Button variant="outline-primary">
                                    Отмена
                                </Button>
                            </Link>
                            <Button type="submit" variant="primary">
                                Обновить
                            </Button>
                        </div>
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
                            Объект успешно обновлён
                        </div>
                    </div>
                </Notification>
                {/* END: Success Notification Content */}
            </div>
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default Main;
