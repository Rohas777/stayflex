import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, FormTextarea } from "@/components/Base/Form";
import { useEffect, useState } from "react";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import TomSelect from "@/components/Base/TomSelect";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchClients } from "@/stores/reducers/clients/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import { IClient } from "@/stores/models/IClient";
import { sendMail } from "@/stores/reducers/mails/actions";

interface SendMailToClientFormProps {
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}
type CustomErrors = {
    isValid: boolean;
    client: string | null;
};

function SendMailToClientForm({
    setIsLoaderOpened,
    isLoaderOpened,
}: SendMailToClientFormProps) {
    const dispatch = useAppDispatch();
    const { clients, clientOne, statusOne, status } = useAppSelector(
        (state) => state.client
    );

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [selectedClientID, setSelectedClientID] = useState<string>("-1");
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        client: null,
    });
    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            client: null,
        };
        if (!clientOne && (selectedClientID === "-1" || !selectedClient)) {
            errors.client = "Обязательно выберите клиента";
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
            subject: yup.string().required("Это обязательное поле"),
            description: yup.string().required("Это обязательное поле"),
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
        startLoader(setIsLoaderOpened);
        const formData = new FormData(event.target);
        const result = await trigger();
        const customResult = await vaildateWithoutYup();
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }
        const mailData = {
            user_mail: clientOne ? clientOne.email : selectedClient!.email,
            subject: String(formData.get("subject")),
            description: String(formData.get("description")),
        };

        await dispatch(sendMail(mailData));
    };

    useEffect(() => {
        dispatch(fetchClients());
    }, []);

    useEffect(() => {
        if (!clientOne) return;

        setSelectedClientID(String(clientOne.id));
        setSelectedClient(clientOne);
    }, [clientOne]);

    useEffect(() => {
        if (selectedClientID === "-1") return;

        setSelectedClient(
            clients.find((client) => client.id === Number(selectedClientID))!
        );
    }, [selectedClientID]);

    if (status === Status.LOADING || statusOne === Status.LOADING)
        return <Loader />;

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Отправить письмо
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-client"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Клиент
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div
                            className={clsx(
                                "border rounded-md border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.client,
                                }
                            )}
                        >
                            <TomSelect
                                id="validation-form-client"
                                value={selectedClientID}
                                name="client"
                                onChange={(e) => {
                                    setSelectedClientID(e.target.value);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        client: null,
                                    }));
                                }}
                                options={{
                                    placeholder: "Выберите клиента",
                                }}
                                className="w-full"
                                disabled={!!clientOne}
                            >
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.fullname}: {client.email}
                                    </option>
                                ))}
                            </TomSelect>
                        </div>
                        {customErrors.client && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.client === "string" &&
                                    customErrors.client}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-subject"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Тема письма
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormInput
                            {...register("subject")}
                            id="validation-form-subject"
                            type="text"
                            name="subject"
                            className={clsx({
                                "border-danger": errors.subject,
                            })}
                            placeholder="Тема"
                        />
                        {errors.subject && (
                            <div className="mt-2 text-danger">
                                {typeof errors.subject.message === "string" &&
                                    errors.subject.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-description"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Содержимое письма
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormTextarea
                            {...register("description")}
                            id="validation-form-description"
                            name="description"
                            className={clsx("min-h-40", {
                                "border-danger": errors.description,
                            })}
                            placeholder="Содержимое"
                        />
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
                        Отправить
                    </Button>
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

export default SendMailToClientForm;
