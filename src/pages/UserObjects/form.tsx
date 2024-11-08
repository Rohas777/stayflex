import "@/assets/css/vendors/tabulator.css";
import "react-phone-input-2/lib/bootstrap.css";
import "@/assets/css/vendors/phoneinput.css";
import ru from "react-phone-input-2/lang/ru.json";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput, FormTextarea } from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import TomSelect from "@/components/Base/TomSelect";
import { RegionCreateType } from "@/stores/reducers/regions/types";
import {
    ReservationCreateType,
    ReservationUpdateType,
} from "@/stores/reducers/reservations/types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { objectSlice } from "@/stores/reducers/objects/slice";
import { clientSlice } from "@/stores/reducers/clients/slice";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Litepicker, { LitepickerElement } from "@/components/Base/Litepicker";
import Lucide from "@/components/Base/Lucide";
import PhoneInput from "react-phone-input-2";
import {
    createClient,
    fetchClientByPhone,
} from "@/stores/reducers/clients/actions";
import Loader from "@/components/Custom/Loader/Loader";
import OpacityLoader from "@/components/Custom/OpacityLoader/Loader";
import { DateTime } from "luxon";
import {
    dayTitle,
    formatDate,
    getDaysBetweenDates,
    startLoader,
    stopLoader,
    validateEndDaterange,
    validateStartDaterange,
} from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { IReservation } from "@/stores/models/IReservation";
import { reservationStatus, reservationStatusesWithNames } from "@/vars";
import { reservationSlice } from "@/stores/reducers/reservations/slice";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { IObject } from "@/stores/models/IObject";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";

interface ReservationFormProps {
    onCreate: (reservation: ReservationCreateType) => void;
    onUpdate: (reservation: ReservationUpdateType) => void;
    onDelete: (id: number) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
    currentUnreservedData?: {
        start_date: string;
        objectID: number;
    } | null;
    currentReservation?: IReservation;
}
type CustomErrors = {
    isValid: boolean;
    object: string | null;
    start_date: string | null;
    end_date: string | null;
    tel: string | null;
    email: string | null;
    name: string | null;
    date: string | null;
};

function ReservationForm({
    onCreate,
    onUpdate,
    onDelete,
    setIsLoaderOpen,
    isLoaderOpen,
    currentReservation,
    currentUnreservedData,
}: ReservationFormProps) {
    console.log(currentUnreservedData);
    const [selectedObjectID, setSelectedObjectID] = useState(
        currentReservation?.object.id
            ? String(currentReservation?.object.id)
            : currentUnreservedData?.objectID
            ? String(currentUnreservedData?.objectID)
            : "-1"
    );
    const [selectedObject, setSelectedObject] = useState<IObject | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<reservationStatus>(
        currentReservation?.status ? currentReservation.status : "new"
    );
    const [startDate, setStartDate] = useState(
        currentReservation?.start_date ||
            currentUnreservedData?.start_date ||
            ""
    );
    const [endDate, setEndDate] = useState(currentReservation?.end_date || "");
    const [tel, setTel] = useState<string>(
        currentReservation?.client?.phone || ""
    );
    const [isTelChecking, setIsTelChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [isCreate, setIsCreate] = useState(true);

    const objectsState = useAppSelector((state) => state.object);
    const clientsState = useAppSelector((state) => state.client);
    const clientActions = clientSlice.actions;

    const dispatch = useAppDispatch();

    const nameValidation = yup.string().required("'Имя' это обязательное поле");
    const emailValidation = yup
        .string()
        .email("Введите корректный email")
        .required("'Email' это обязательное поле");

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        object: null,
        start_date: null,
        end_date: null,
        tel: null,
        email: null,
        name: null,
        date: null,
    });

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            object: null,
            start_date: null,
            end_date: null,
            tel: null,
            email: null,
            name: null,
            date: null,
        };
        if (selectedObjectID === "-1") {
            errors.object = "Обязательно выберите объект";
        }
        if (!validateStartDaterange(startDate, endDate).isValid) {
            errors.start_date = validateStartDaterange(
                startDate,
                endDate
            ).error;
        }
        if (!validateEndDaterange(startDate, endDate).isValid) {
            errors.end_date = validateEndDaterange(startDate, endDate).error;
        }
        if (
            getDaysBetweenDates(startDate, endDate) < selectedObject?.min_ded!
        ) {
            errors.date =
                "Минимальный срок бронирования: " +
                selectedObject?.min_ded +
                " " +
                dayTitle(selectedObject?.min_ded!);
        }

        if (!tel) {
            errors.tel = "Обязательно введите телефон клиента";
        }
        if (!clientsState.isFound && clientsState.isFound !== null) {
            await nameValidation.validate(formData.get("name")).catch((err) => {
                errors.name = err.message;
            });
            await emailValidation
                .validate(formData.get("email"))
                .catch((err) => {
                    errors.email = err.message;
                });
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
    const schema = yup
        .object({
            description: yup
                .string()
                .required("'Дополнительная информация' это обязательное поле"),
            letter: yup
                .string()
                .required("'Дополнительная информация' это обязательное поле"),
        })
        .required();

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
        setIsSubmitting(true);
        startLoader(setIsLoaderOpen);

        const form = new FormData(event.target);
        const customResult = await vaildateWithoutYup(form);
        const result = await trigger();
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpen);
            return;
        }
        setFormData(form);

        if (!clientsState.isFound && clientsState.isFound !== null) {
            await dispatch(
                createClient({
                    fullname: String(form.get("name")),
                    email: String(form.get("email")),
                    phone: tel!,
                    reiting: 0,
                })
            );
        }
    };

    useEffect(() => {
        if (!formData || !isSubmitting) return;
        if (clientsState.isCreated) {
            const reservationData: ReservationCreateType = {
                start_date: formatDate(new Date(startDate)),
                end_date: formatDate(new Date(endDate)),
                object_id: Number(selectedObjectID),
                client_id: clientsState.createdClient?.id!,
                description: String(formData?.get("description")),
                letter: String(formData?.get("letter")),
                status: selectedStatus,
            };
            if (isCreate) {
                onCreate(reservationData);
            } else {
                onUpdate({
                    id: currentReservation?.id!,
                    ...reservationData,
                });
            }
            dispatch(clientActions.resetIsCreated());
            setIsSubmitting(false);
        }
        if (clientsState.isFound) {
            const reservationData: ReservationCreateType = {
                start_date: formatDate(new Date(startDate)),
                end_date: formatDate(new Date(endDate)),
                object_id: Number(selectedObjectID),
                client_id: clientsState.clientByPhone?.id!,
                description: String(formData?.get("description")),
                letter: String(formData?.get("letter")),
                status: selectedStatus,
            };
            if (isCreate) {
                onCreate(reservationData);
            } else {
                onUpdate({
                    id: currentReservation?.id!,
                    ...reservationData,
                });
            }
            dispatch(clientActions.resetIsCreated());
            setIsSubmitting(false);
        }
    }, [clientsState.isFound, clientsState.isCreated, isSubmitting, formData]);

    useEffect(() => {
        if (!currentReservation) return;
        setIsCreate(false);
        setIsTelChecking(true);
        dispatch(fetchClientByPhone(currentReservation.client.phone));
    }, [currentReservation]);

    useEffect(() => {
        if (clientsState.statusByPhone !== Status.LOADING) {
            setIsTelChecking(false);
        }
    }, [clientsState.statusByPhone]);

    useEffect(() => {
        if (Number(selectedObjectID) <= 0) return;
        setSelectedObject(
            objectsState.objects.find(
                (object) => object.id === Number(selectedObjectID)
            )!
        );
    }, [selectedObjectID]);
    if (
        objectsState.status === Status.LOADING &&
        clientsState.statusByPhone !== Status.LOADING
    ) {
        return <Loader />;
    }
    return (
        <>
            {isLoaderOpen && <OverlayLoader />}

            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    {isCreate ? "Добавить" : "Редактировать"} бронь
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-object"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Объект
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div
                            className={clsx(
                                "border rounded-md border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.object,
                                }
                            )}
                        >
                            <TomSelect
                                id="validation-form-object"
                                value={selectedObjectID}
                                onChange={(e) => {
                                    setSelectedObjectID(e.target.value);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        object: null,
                                    }));
                                }}
                                options={{
                                    placeholder: "Выберите объект",
                                }}
                                className="w-full"
                            >
                                {objectsState.objects.map((object) => {
                                    return (
                                        <option
                                            key={object.id}
                                            value={object.id}
                                        >
                                            {object.name}
                                        </option>
                                    );
                                })}
                            </TomSelect>
                        </div>
                        {customErrors.object && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.object === "string" &&
                                    customErrors.object}
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-form col-span-1">
                                <FormLabel
                                    htmlFor="validation-form-start-date"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Дата заезда
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <div className="flex gap-1 items-center">
                                    <div className="litepicker-wrapper relative w-full">
                                        <FormLabel
                                            className={clsx(
                                                "absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400",
                                                {
                                                    "border-danger-important":
                                                        customErrors.start_date ||
                                                        customErrors.date,
                                                }
                                            )}
                                            htmlFor="validation-form-start-date"
                                        >
                                            <Lucide icon="CalendarDays" />
                                        </FormLabel>
                                        <Litepicker
                                            value={startDate}
                                            id="validation-form-start-date"
                                            name="date"
                                            options={{
                                                lang: "RU-ru",
                                                autoApply: true,
                                                singleMode: true,
                                                showWeekNumbers: false,
                                                dropdowns: {
                                                    minYear:
                                                        new Date().getFullYear(),
                                                    maxYear:
                                                        new Date().getFullYear() +
                                                        2,
                                                    months: true,
                                                    years: true,
                                                },
                                            }}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setCustomErrors((prev) => ({
                                                    ...prev,
                                                    start_date: null,
                                                    date: null,
                                                }));
                                            }}
                                            className={clsx(
                                                "pl-12 block w-full rounded-md border",
                                                {
                                                    "border-danger-important":
                                                        customErrors.start_date ||
                                                        customErrors.date,
                                                }
                                            )}
                                            placeholder="Выберите дату заезда"
                                        />
                                    </div>
                                </div>
                                {customErrors.start_date && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.start_date ===
                                            "string" && customErrors.start_date}
                                    </div>
                                )}
                            </div>
                            <div className="input-form col-span-1">
                                <FormLabel
                                    htmlFor="validation-form-end-date"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Дата выезда
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <div className="flex gap-1 items-center">
                                    <div className="litepicker-wrapper relative w-full">
                                        <FormLabel
                                            htmlFor="validation-form-end-date"
                                            className={clsx(
                                                "absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400",
                                                {
                                                    "border-danger-important":
                                                        customErrors.end_date ||
                                                        customErrors.date,
                                                }
                                            )}
                                        >
                                            <Lucide icon="CalendarDays" />
                                        </FormLabel>
                                        <Litepicker
                                            value={endDate}
                                            id="validation-form-end-date"
                                            name="date"
                                            options={{
                                                lang: "RU-ru",
                                                autoApply: true,
                                                singleMode: true,
                                                showWeekNumbers: false,
                                                dropdowns: {
                                                    minYear:
                                                        new Date().getFullYear(),
                                                    maxYear:
                                                        new Date().getFullYear() +
                                                        2,
                                                    months: true,
                                                    years: true,
                                                },
                                            }}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                setCustomErrors((prev) => ({
                                                    ...prev,
                                                    end_date: null,
                                                    date: null,
                                                }));
                                            }}
                                            className={clsx(
                                                "pl-12 block w-full border rounded-md border",
                                                {
                                                    "border-danger-important":
                                                        customErrors.end_date ||
                                                        customErrors.date,
                                                }
                                            )}
                                            placeholder="Выберите дату выезда"
                                        />
                                    </div>
                                </div>
                                {customErrors.end_date && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.end_date ===
                                            "string" && customErrors.end_date}
                                    </div>
                                )}
                            </div>
                        </div>
                        {customErrors.date && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.date === "string" &&
                                    customErrors.date}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-tel"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Номер телефона клиента
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div className="custom-phone-input relative">
                            {clientsState.statusByPhone === Status.LOADING &&
                                isTelChecking && <OpacityLoader />}
                            <PhoneInput
                                country="ru"
                                localization={ru}
                                value={tel}
                                disabled={isTelChecking}
                                onChange={(
                                    value,
                                    country,
                                    e,
                                    formattedValue
                                ) => {
                                    setTel(formattedValue);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        tel: null,
                                    }));
                                    const typedCountry = country as {
                                        countryCode: string;
                                        dialCode: string;
                                        format: string;
                                        name: string;
                                    };
                                    const maskLength = typedCountry.format
                                        .split("")
                                        .filter((char) => char === ".").length;
                                    if (
                                        maskLength > value.length &&
                                        clientsState.statusByPhone !==
                                            Status.LOADING
                                    ) {
                                        dispatch(
                                            clientActions.resetClientByPhone()
                                        );
                                    }
                                    if (maskLength === value.length) {
                                        setIsTelChecking(true);
                                        dispatch(
                                            fetchClientByPhone(formattedValue)
                                        );
                                    }
                                }}
                                inputClass={clsx({
                                    "border-danger-important": customErrors.tel,
                                })}
                                inputProps={{
                                    id: "validation-form-tel",
                                }}
                                isValid={(value, country, formattedValue) => {
                                    return true;
                                }}
                            />
                        </div>
                        {customErrors.tel && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.tel === "string" &&
                                    customErrors.tel}
                            </div>
                        )}
                    </div>

                    {!clientsState.isFound && clientsState.isFound !== null && (
                        <>
                            <div className="input-form mt-3">
                                <FormLabel
                                    htmlFor="validation-form-email"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Email
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    id="validation-form-email"
                                    type="text"
                                    name="email"
                                    onChange={() => {
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            email: null,
                                        }));
                                    }}
                                    className={clsx({
                                        "border-danger": customErrors.email,
                                    })}
                                    placeholder="example@ex.com"
                                />
                                {customErrors.email && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.email ===
                                            "string" && customErrors.email}
                                    </div>
                                )}
                            </div>
                            <div className="input-form mt-3">
                                <FormLabel
                                    htmlFor="validation-form-name"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    ФИО
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    id="validation-form-name"
                                    type="text"
                                    name="name"
                                    onChange={() => {
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            name: null,
                                        }));
                                    }}
                                    className={clsx({
                                        "border-danger": customErrors.name,
                                    })}
                                    placeholder="Иванов И.И."
                                />
                                {customErrors.name && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.name ===
                                            "string" && customErrors.name}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {clientsState.isFound && (
                        <>
                            <ul className="mt-3 ml-2">
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        Email:
                                    </strong>
                                    {clientsState.clientByPhone?.email}
                                </li>
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        ФИО:
                                    </strong>
                                    {clientsState.clientByPhone?.fullname}
                                </li>
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        Оценка:
                                    </strong>
                                    {clientsState.clientByPhone?.reiting
                                        ? "★".repeat(
                                              clientsState.clientByPhone
                                                  ?.reiting
                                          )
                                        : "Без оценки"}
                                </li>
                            </ul>
                        </>
                    )}
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-description"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Дополнительная информация
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormTextarea
                            {...register("description")}
                            id="validation-form-description"
                            name="description"
                            className={clsx({
                                "border-danger": errors.description,
                            })}
                            defaultValue={
                                currentReservation &&
                                currentReservation.description
                            }
                            placeholder="Дополнительная информация о брони"
                        ></FormTextarea>
                        {errors.description && (
                            <div className="mt-2 text-danger">
                                {typeof errors.description.message ===
                                    "string" && errors.description.message}
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
                            defaultValue={
                                currentReservation && currentReservation.letter
                            }
                            placeholder="Ключи под ковриком"
                        ></FormTextarea>
                        {errors.letter && (
                            <div className="mt-2 text-danger">
                                {typeof errors.letter.message === "string" &&
                                    errors.letter.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-status"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Статус
                        </FormLabel>
                        <TomSelect
                            id="validation-form-status"
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCustomErrors((prev) => ({
                                    ...prev,
                                    status: null,
                                }));
                            }}
                            options={{
                                placeholder: "Выберите статус",
                            }}
                            className="w-full"
                        >
                            {reservationStatusesWithNames.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </TomSelect>
                    </div>
                    <div className="flex gap-3">
                        {!isCreate && (
                            <Button
                                type="button"
                                variant="danger"
                                className="w-full mt-5"
                                onClick={() => {
                                    startLoader(setIsLoaderOpen);
                                    currentReservation &&
                                        onDelete(currentReservation?.id);
                                }}
                            >
                                Удалить
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full mt-5"
                        >
                            {isCreate ? "Добавить" : "Обновить"}
                        </Button>
                    </div>
                </form>
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

export default ReservationForm;
