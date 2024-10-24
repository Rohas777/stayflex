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
import { formatDate, startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { IReservation } from "@/stores/models/IReservation";

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
    const [selectedObject, setSelectedObject] = useState(
        currentReservation?.object.id
            ? String(currentReservation?.object.id)
            : currentUnreservedData?.objectID
            ? String(currentUnreservedData?.objectID)
            : "-1"
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
    const objectActions = objectSlice.actions;
    const clientActions = clientSlice.actions;

    const dispatch = useAppDispatch();

    const nameValidation = yup.string().required("'Имя' это обязательное поле");
    const emailValidation = yup
        .string()
        .email("Введите корректный email")
        .required("'Email' это обязательное поле");

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        object: null,
        start_date: null,
        end_date: null,
        tel: null,
        email: null,
        name: null,
    });

    const validateStartDaterange = (stardDate: string, endDate: string) => {
        if (!stardDate) {
            const error = "Обязательно выберите дату заезда";
            return {
                isValid: false,
                error: error,
            };
        }
        if (!new Date(startDate)) {
            const error = "Введите корректную дату заезда";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(startDate) < new Date()) {
            const error = "Дата заезда не может быть раньше сегодняшней";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(startDate) > new Date(endDate)) {
            const error = "Дата заезда не может быть позже даты выезда";
            return {
                isValid: false,
                error: error,
            };
        }
        return {
            isValid: true,
            error: null,
        };
    };
    const validateEndDaterange = (stardDate: string, endDate: string) => {
        if (!endDate) {
            const error = "Обязательно выберите дату выезда";
            return {
                isValid: false,
                error: error,
            };
        }
        if (!new Date(endDate)) {
            const error = "Введите корректную дату выезда";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(endDate) < new Date()) {
            const error = "Дата выезда не может быть раньше сегодняшней";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(startDate) > new Date(endDate)) {
            const error = "Дата выезда не может быть раньше даты заезда";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(endDate).getFullYear() > new Date().getFullYear() + 2) {
            const error = "Дата выезда не может быть больше 2-х лет";
            return {
                isValid: false,
                error: error,
            };
        }
        return {
            isValid: true,
            error: null,
        };
    };

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            object: null,
            start_date: null,
            end_date: null,
            tel: null,
            email: null,
            name: null,
        };
        if (selectedObject === "-1") {
            errors.object = "Обязательно выберите объект";
        }
        if (selectedObject === "-1") {
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
        if (!tel) {
            errors.tel = "Обязательно введите телефон клиента";
        }
        if (clientsState.statusByPhone === Status.ERROR) {
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
            stopLoader(setIsLoaderOpen);
            return;
        }
        setFormData(form);

        if (clientsState.statusByPhone === Status.ERROR) {
            await dispatch(
                createClient({
                    client_data: {
                        fullname: String(form.get("name")),
                        email: String(form.get("email")),
                        phone: tel!,
                        reiting: 0, //FIXME
                    },
                    user_id: 6, //FIXME
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
                object_id: Number(selectedObject),
                client_id: clientsState.createdClient?.id!,
                description: String(formData?.get("description")),
            };
            if (isCreate) {
                onCreate(reservationData);
            } else {
                onUpdate({
                    id: currentReservation?.id!,
                    status: currentReservation?.status!,
                    ...reservationData,
                });
            }
            dispatch(clientActions.resetIsCreated());
            setIsSubmitting(false);
        }
        if (clientsState.statusByPhone === Status.SUCCESS) {
            const reservationData: ReservationCreateType = {
                start_date: formatDate(new Date(startDate)),
                end_date: formatDate(new Date(endDate)),
                object_id: Number(selectedObject),
                client_id: clientsState.clientByPhone?.id!,
                description: String(formData?.get("description")),
            };
            if (isCreate) {
                onCreate(reservationData);
            } else {
                onUpdate({
                    id: currentReservation?.id!,
                    status: currentReservation?.status!,
                    ...reservationData,
                });
            }
            dispatch(clientActions.resetIsCreated());
            setIsSubmitting(false);
        }
    }, [
        clientsState.statusByPhone,
        clientsState.isCreated,
        isSubmitting,
        formData,
    ]);

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
                                value={selectedObject}
                                onChange={(e) => {
                                    setSelectedObject(e.target.value);
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
                    <div className="input-form mt-3">
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
                            <div className="relative w-full">
                                <FormLabel
                                    className={clsx(
                                        "absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400",
                                        {
                                            "border-danger-important":
                                                customErrors.start_date,
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
                                        autoApply: false,
                                        singleMode: true,
                                        showWeekNumbers: false,
                                        dropdowns: {
                                            minYear: new Date().getFullYear(),
                                            maxYear:
                                                new Date().getFullYear() + 2,
                                            months: true,
                                            years: true,
                                        },
                                    }}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        console.log(e.target.value);
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            start_date: null,
                                        }));
                                    }}
                                    className={clsx(
                                        "pl-12 block w-full border rounded-md border",
                                        {
                                            "border-danger-important":
                                                customErrors.start_date,
                                        }
                                    )}
                                    placeholder="Выберите дату заезда"
                                />
                            </div>
                        </div>
                        {customErrors.start_date && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.start_date === "string" &&
                                    customErrors.start_date}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
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
                            <div className="relative w-full">
                                <FormLabel
                                    htmlFor="validation-form-end-date"
                                    className={clsx(
                                        "absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400",
                                        {
                                            "border-danger-important":
                                                customErrors.end_date,
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
                                        autoApply: false,
                                        singleMode: true,
                                        showWeekNumbers: false,
                                        dropdowns: {
                                            minYear: new Date().getFullYear(),
                                            maxYear:
                                                new Date().getFullYear() + 2,
                                            months: true,
                                            years: true,
                                        },
                                    }}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setCustomErrors((prev) => ({
                                            ...prev,
                                            end_date: null,
                                        }));
                                    }}
                                    className={clsx(
                                        "pl-12 block w-full border rounded-md border",
                                        {
                                            "border-danger-important":
                                                customErrors.end_date,
                                        }
                                    )}
                                    placeholder="Выберите дату выезда"
                                />
                            </div>
                        </div>
                        {customErrors.end_date && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.end_date === "string" &&
                                    customErrors.end_date}
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

                    {clientsState.statusByPhone === Status.ERROR && (
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
                    {clientsState.statusByPhone === Status.SUCCESS && (
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
        </>
    );
}

export default ReservationForm;
