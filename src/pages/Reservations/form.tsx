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
import { ReservationCreateType } from "@/stores/reducers/reservations/types";
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

interface ReservationFormProps {
    onCreate: (name: ReservationCreateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}
type CustomErrors = {
    isValid: boolean;
    object: string | null;
    date: string | null;
    tel: string | null;
    email: string | null;
    name: string | null;
};

function ReservationForm({
    onCreate,
    setIsLoaderOpen,
    isLoaderOpen,
}: ReservationFormProps) {
    const [selectedObject, setSelectedObject] = useState("-1");
    const [daterange, setDaterange] = useState("");
    const [tel, setTel] = useState<string>();
    const [isTelChecking, setIsTelChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>();

    const objectsState = useAppSelector((state) => state.object);
    const clientsState = useAppSelector((state) => state.client);
    const {} = objectSlice.actions;
    const clientActions = clientSlice.actions;

    const dispatch = useAppDispatch();

    const customSchema = yup.object({
        email: yup
            .string()
            .email("Введите корректный email")
            .required("'Email' это обязательное поле"),
        names: yup.string().required("'Имя' это обязательное поле"),
    });
    const nameValidation = yup.string().required("'Имя' это обязательное поле");
    const emailValidation = yup
        .string()
        .email("Введите корректный email")
        .required("'Email' это обязательное поле");

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        object: null,
        date: null,
        tel: null,
        email: null,
        name: null,
    });

    const validateDateRange = (value: string) => {
        if (!value) {
            const error = "Обязательно выберите дату";
            return {
                isValid: false,
                error: error,
            };
        }
        const [startDate, endDate] = value.split(" - ");
        if (!new Date(startDate) || !new Date(endDate)) {
            const error = "Введите корректную дату";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(startDate) > new Date(endDate)) {
            const error = "Начальная дата не может быть больше конечной";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(startDate) < new Date()) {
            const error = "Начальная дата не может быть меньше сегодняшней";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(endDate) < new Date()) {
            const error = "Конечная дата не может быть меньше сегодняшней";
            return {
                isValid: false,
                error: error,
            };
        }
        if (new Date(endDate).getFullYear() > new Date().getFullYear() + 2) {
            const error = "Конечная дата не может быть больше 2-х лет";
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
            date: null,
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
        if (!validateDateRange(daterange).isValid) {
            errors.date = validateDateRange(daterange).error;
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
        // const successEl = document
        //     .querySelectorAll("#success-notification-content")[0]
        //     .cloneNode(true) as HTMLElement;
        // successEl.classList.remove("hidden");
        // Toastify({
        //     node: successEl,
        //     duration: 3000,
        //     newWindow: true,
        //     close: true,
        //     gravity: "top",
        //     position: "right",
        //     stopOnFocus: true,
        // }).showToast();

        if (clientsState.statusByPhone === Status.ERROR) {
            await dispatch(
                createClient({
                    client_data: {
                        fullname: String(form.get("name")),
                        email: String(form.get("email")),
                        phone: tel!,
                        reiting: 0, //FIXME
                    },
                    user_id: 3, //FIXME
                })
            );
        }
    };

    useEffect(() => {
        if (isSubmitting && clientsState.isCreated) {
            const [startDate, endDate] = daterange.split(" - ");
            const reservationData: ReservationCreateType = {
                start_date: formatDate(new Date(startDate)),
                end_date: formatDate(new Date(endDate)),
                object_id: Number(selectedObject),
                client_id: clientsState.createdClient?.id!,
                description: String(formData?.get("description")),
            };
            onCreate(reservationData);
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
                    Добавить бронь
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
                            htmlFor="validation-form-date"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Дата
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div className="flex gap-1 items-center">
                            <FormLabel
                                htmlFor="validation-form-date"
                                className="mb-0"
                            >
                                <Lucide icon="Calendar" />
                            </FormLabel>
                            <Litepicker
                                value={daterange}
                                id="validation-form-date"
                                name="date"
                                options={{
                                    lang: "RU-ru",
                                    autoApply: false,
                                    singleMode: false,
                                    numberOfColumns: 2,
                                    numberOfMonths: 2,
                                    showWeekNumbers: false,
                                    dropdowns: {
                                        minYear: new Date().getFullYear(),
                                        maxYear: new Date().getFullYear() + 2,
                                        months: true,
                                        years: true,
                                    },
                                    showTooltip: true,
                                }}
                                onChange={(e) => {
                                    setDaterange(e.target.value);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        date: null,
                                    }));
                                }}
                                className={clsx(
                                    "block w-full border rounded-md border-transparent",
                                    {
                                        "border-danger-important":
                                            customErrors.date,
                                    }
                                )}
                                placeholder="Выберите дату"
                            />
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
                            placeholder="Дополнительная информация о брони"
                        ></FormTextarea>
                        {errors.description && (
                            <div className="mt-2 text-danger">
                                {typeof errors.description.message ===
                                    "string" && errors.description.message}
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-5"
                    >
                        Добавить
                    </Button>
                </form>
            </div>
        </>
    );
}

export default ReservationForm;
