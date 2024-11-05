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
import {
    FormLabel,
    FormInput,
    FormTextarea,
    FormCheck,
} from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import TomSelect from "@/components/Base/TomSelect";
import { ReservationCreateType } from "@/stores/reducers/reservations/types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { clientSlice } from "@/stores/reducers/clients/slice";
import { Status } from "@/stores/reducers/types";
import Litepicker, { LitepickerElement } from "@/components/Base/Litepicker";
import Lucide from "@/components/Base/Lucide";
import PhoneInput from "react-phone-input-2";
import Loader from "@/components/Custom/Loader/Loader";
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
import { IObject } from "@/stores/models/IObject";

interface ReservationFormProps {
    // onCreate: (reservation: ReservationCreateType) => void; //FIXME -
    onCreate: () => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
    object: IObject;
}
type CustomErrors = {
    isValid: boolean;
    start_date: string | null;
    end_date: string | null;
    date: string | null;
    tel: string | null;
    terms: string | null;
    child_count: string | null;
};

function ReservationForm({
    onCreate,
    setIsLoaderOpen,
    isLoaderOpen,
    object,
}: ReservationFormProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tel, setTel] = useState<string>("");
    const [formData, setFormData] = useState<FormData | null>(null);
    const [selectedDays, setSelectedDays] = useState<number>(1);
    const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);

    const objectsState = useAppSelector((state) => state.object);
    const clientActions = clientSlice.actions;

    const dispatch = useAppDispatch();

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        start_date: null,
        end_date: null,
        tel: null,
        terms: null,
        child_count: null,
        date: null,
    });

    const childCountValidation = yup
        .number()
        .lessThan(
            object.child_places + 1,
            `Максимальное количество детских спальных мест: ${object.child_places}`
        )
        .typeError("Количество спальных мест должно быть числовым значением")
        .positive("Количество спальных мест не может быть отрицательным")
        .integer("Количество спальных мест должно быть целым числом")
        .moreThan(-1, "Минимальное количество детских спальных мест: 0")
        .required("'Количество детских спальных мест' это обязательное поле");

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            start_date: null,
            end_date: null,
            tel: null,
            child_count: null,
            terms: null,
            date: null,
        };
        if (!validateStartDaterange(startDate, endDate).isValid) {
            errors.start_date = validateStartDaterange(
                startDate,
                endDate
            ).error;
        }
        if (!validateEndDaterange(startDate, endDate).isValid) {
            errors.end_date = validateEndDaterange(startDate, endDate).error;
        }

        if (getDaysBetweenDates(startDate, endDate) < object.min_ded) {
            errors.date =
                "Минимальный срок бронирования: " +
                object.min_ded +
                " " +
                dayTitle(object.min_ded!);
        }
        if (!tel) {
            errors.tel = "Обязательно введите телефон клиента";
        }
        if (object.child_places > 0) {
            await childCountValidation
                .validate(formData.get("child_count"))
                .catch((err) => {
                    errors.child_count = err.message;
                });
        }
        if (isTermsChecked === false) {
            errors.terms =
                "Для продолжения вам необходимо согласиться с условиями";
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
            name: yup.string().required("'Имя' это обязательное поле"),
            email: yup
                .string()
                .email("Введите корректный email")
                .required("'Email' это обязательное поле"),
            description: yup
                .string()
                .required("'Дополнительная информация' это обязательное поле"),
            adult_count: yup
                .number()
                .lessThan(
                    object.adult_places + 1,
                    `Максимальное количество взрослых спальных мест: ${object.adult_places}`
                )
                .typeError(
                    "Количество спальных мест должно быть числовым значением"
                )
                .positive(
                    "Количество спальных мест не может быть отрицательным"
                )
                .integer("Количество спальных мест должно быть целым числом")
                .moreThan(0, "Минимальное количество взрослых спальных мест: 1")
                .required(
                    "'Количество взрослых спальных мест' это обязательное поле"
                ),
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
        startLoader(setIsLoaderOpen);

        const form = new FormData(event.target);
        const customResult = await vaildateWithoutYup(form);
        const result = await trigger();
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpen);
            return;
        }
        setFormData(form);
        const reservationData = {
            start_date: formatDate(new Date(startDate)),
            end_date: formatDate(new Date(endDate)),
            object_id: object.id,
            tel: tel,
            name: String(formData?.get("name")),
            email: String(formData?.get("email")),
            adult_count: Number(formData?.get("adult_count")),
            child_count: Number(formData?.get("child_count")),
            description: String(formData?.get("description")),
            status: "new", //FIXME -
        };
        onCreate();
        dispatch(clientActions.resetIsCreated());
    };

    useEffect(() => {
        const days = getDaysBetweenDates(startDate, endDate);
        setSelectedDays(days === 0 ? 1 : days);
    }, [startDate, endDate]);

    if (objectsState.status === Status.LOADING) {
        return <Loader />;
    }
    return (
        <>
            {isLoaderOpen && <OverlayLoader />}

            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Забронировать
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="mt-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1 input-form">
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
                                                "pl-12 block w-full border rounded-md border",
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
                            <div className="col-span-1 input-form">
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
                            Ваш номер телефона
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div className="custom-phone-input relative">
                            <PhoneInput
                                country="ru"
                                localization={ru}
                                value={tel}
                                onChange={(formattedValue) => {
                                    setTel(formattedValue);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        tel: null,
                                    }));
                                }}
                                inputClass={clsx({
                                    "border-danger-important": customErrors.tel,
                                })}
                                inputProps={{
                                    id: "validation-form-tel",
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

                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-email"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Ваш email
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormInput
                            {...register("email")}
                            id="validation-form-email"
                            type="text"
                            name="email"
                            className={clsx({
                                "border-danger": errors.email,
                            })}
                            placeholder="example@ex.com"
                        />
                        {errors.email && (
                            <div className="mt-2 text-danger">
                                {typeof errors.email.message === "string" &&
                                    errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Ваши ФИО
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
                            placeholder="Иванов И.И."
                        />
                        {errors.name && (
                            <div className="mt-2 text-danger">
                                {typeof errors.name.message === "string" &&
                                    errors.name.message}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div
                            className={clsx("input-form", {
                                "col-span-1": object.child_places > 0,
                                "col-span-2": object.child_places <= 0,
                            })}
                        >
                            <FormLabel
                                htmlFor="validation-form-adult_count"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                {object.child_places > 0
                                    ? "Взрослых"
                                    : "Гостей"}
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("adult_count")}
                                id="validation-form-adult_count"
                                type="number"
                                name="adult_count"
                                className={clsx({
                                    "border-danger": errors.adult_count,
                                })}
                                placeholder="2"
                            />
                            {errors.adult_count && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.adult_count.message ===
                                        "string" && errors.adult_count.message}
                                </div>
                            )}
                        </div>
                        {object.child_places > 0 && (
                            <div className="col-span-1 input-form">
                                <FormLabel
                                    htmlFor="validation-form-child_count"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Детей
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Обязательное
                                    </span>
                                </FormLabel>
                                <FormInput
                                    id="validation-form-child_count"
                                    type="number"
                                    name="child_count"
                                    className={clsx({
                                        "border-danger":
                                            customErrors.child_count,
                                    })}
                                    onChange={(e) => {
                                        setCustomErrors({
                                            ...customErrors,
                                            child_count: null,
                                        });
                                    }}
                                    placeholder="1"
                                />
                                {customErrors.child_count && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.child_count ===
                                            "string" &&
                                            customErrors.child_count}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-description"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Ваши пожелания
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
                    <p className="mt-3">
                        Сумма бронирования {object.price * selectedDays} ₽. Для
                        того, чтобы забронировать объект, вам нужно внести
                        предоплату{" "}
                        {Math.round(
                            (object.price *
                                selectedDays *
                                object.prepayment_percentage) /
                                100
                        )}{" "}
                        ₽
                    </p>
                    <div className="flex items-center mt-4 text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
                        <FormCheck.Input
                            id="remember-me"
                            type="checkbox"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setIsTermsChecked(e.target.checked);
                                if (e.target.checked) {
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        terms: null,
                                    }));
                                }
                            }}
                            className={clsx("size-4 mr-2", {
                                "border-danger": customErrors.terms,
                            })}
                        />
                        <label
                            className="cursor-pointer select-none"
                            htmlFor="remember-me"
                        >
                            Я согласен с условиями
                            <a
                                className="ml-1 text-primary dark:text-slate-200"
                                target="_blank"
                                href="/terms"
                            >
                                политики конфиденциальности
                            </a>
                            .
                        </label>
                    </div>
                    {customErrors.terms && (
                        <div className="mt-2 text-danger">
                            {typeof customErrors.terms === "string" &&
                                customErrors.terms}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full mt-5"
                        >
                            Забронировать
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ReservationForm;
