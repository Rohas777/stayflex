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
import {
    ReservationClientCreateType,
    ReservationCreateType,
} from "@/stores/reducers/reservations/types";
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
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import { ClientCreateType } from "@/stores/reducers/clients/types";
import OpacityLoader from "@/components/Custom/OpacityLoader/Loader";
import { fetchClientByPhone } from "@/stores/reducers/clients/actions";
import Icon from "@/components/Custom/Icon";
import Notification from "@/components/Base/Notification";

interface ClientFormProps {
    onCreate: (reservation: ClientCreateType) => void;
    onSave: (client_id: number) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}
type CustomErrors = {
    isValid: boolean;
    tel: string | null;
    email: string | null;
    name: string | null;
};

function ClientForm({
    onCreate,
    onSave,
    setIsLoaderOpen,
    isLoaderOpen,
}: ClientFormProps) {
    const [tel, setTel] = useState<string>("");

    const { clientByPhone, statusByPhone, errorByPhone, isFound, clients } =
        useAppSelector((state) => state.client);
    const { authorizedUser } = useAppSelector((state) => state.user);
    const [isTelChecking, setIsTelChecking] = useState(false);
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
        tel: null,
        email: null,
        name: null,
    });

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            tel: null,
            email: null,
            name: null,
        };

        if (!tel) {
            errors.tel = "Обязательно введите телефон клиента";
        }
        if (!isFound && isFound !== null) {
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

    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        startLoader(setIsLoaderOpen);

        const formData = new FormData(event.target);
        const customResult = await vaildateWithoutYup(formData);
        if (!customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpen);
            return;
        }

        if (!isFound) {
            const clientData = {
                fullname: String(formData.get("name")),
                phone: tel,
                email: String(formData.get("email")),
                reiting: 0,
            };
            onCreate(clientData);
        }
    };

    const addClient = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!clientByPhone) return;
        onSave(clientByPhone?.id);
    };

    useEffect(() => {
        if (statusByPhone !== Status.LOADING) {
            setIsTelChecking(false);
        }
    }, [statusByPhone]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить клиента
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
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
                            {statusByPhone === Status.LOADING &&
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
                                        statusByPhone !== Status.LOADING
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

                    {!isFound && isFound !== null && (
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
                    {isFound && (
                        <>
                            <ul className="mt-3 ml-2">
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        Email:
                                    </strong>
                                    {clientByPhone?.email}
                                </li>
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        ФИО:
                                    </strong>
                                    {clientByPhone?.fullname}
                                </li>
                                <li className="mt-1">
                                    <strong className="inline-block w-20">
                                        Оценка:
                                    </strong>
                                    {clientByPhone?.reiting
                                        ? "★".repeat(clientByPhone?.reiting)
                                        : "Без оценки"}
                                </li>
                            </ul>
                        </>
                    )}
                    <div className="flex gap-3">
                        {isFound &&
                            !authorizedUser?.is_admin &&
                            !clients.find(
                                (client) => client.id === clientByPhone?.id
                            ) && (
                                <Button
                                    variant="primary"
                                    className="w-full mt-5"
                                    onClick={addClient}
                                >
                                    Сохранить
                                </Button>
                            )}
                        {isFound &&
                            (authorizedUser?.is_admin ||
                                clients.find(
                                    (client) => client.id === clientByPhone?.id
                                )) && (
                                <div className="w-full mt-5 flex items-center justify-center">
                                    <Icon
                                        icon="CheckCircle"
                                        className="size-6 mr-2 text-success"
                                    />
                                    Такой клиент уже существует
                                </div>
                            )}
                        {!isFound && (
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full mt-5"
                            >
                                Добавить
                            </Button>
                        )}
                    </div>
                </form>
            </div>
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="on-dev-notification-content"
                className="flex hidden"
            >
                <Icon icon="Wrench" className="text-pending" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content"></div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default ClientForm;
