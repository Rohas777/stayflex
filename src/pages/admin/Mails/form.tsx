import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, FormTextarea } from "@/components/Base/Form";
import { useState } from "react";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";

interface MailFormProps {
    onCreate: (mailData: any) => void;
    // onCreate: (amenityData: MailCreateType) => void;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
    isCreate: boolean;
}

function MailForm({
    onCreate,
    setIsLoaderOpened,
    isLoaderOpened,
    isCreate,
}: MailFormProps) {
    const [showValidationNotification, setShowValidationNotification] =
        useState(false);

    const schema = yup
        .object({
            name: yup.string().required("Это обязательное поле"),
            subject: yup.string().required("Это обязательное поле"),
            body: yup.string().required("Это обязательное поле"),
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
        if (!result) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }
        const mailData = {
            name: String(formData.get("name")),
            subject: String(formData.get("subject")),
            body: String(formData.get("body")),
        };

        onCreate(mailData);
    };

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    {isCreate ? "Добавить" : "Редактировать"} шаблон письма
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Название шаблона
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
                            placeholder="Название"
                        />
                        {errors.name && (
                            <div className="mt-2 text-danger">
                                {typeof errors.name.message === "string" &&
                                    errors.name.message}
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
                            htmlFor="validation-form-body"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Содержимое письма
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormTextarea
                            {...register("body")}
                            id="validation-form-body"
                            name="body"
                            className={clsx("min-h-40", {
                                "border-danger": errors.body,
                            })}
                            placeholder="Содержимое"
                        />
                        {errors.body && (
                            <div className="mt-2 text-danger">
                                {typeof errors.body.message === "string" &&
                                    errors.body.message}
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
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default MailForm;
