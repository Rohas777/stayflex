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
import { IMail } from "@/stores/models/IMail";
import Loader from "@/components/Custom/Loader/Loader";
import { template } from "lodash";
import { UpdateMail } from "@/stores/reducers/mails/types";

interface MailFormProps {
    onUpdate: (mailData: UpdateMail) => void;
    currentMail: IMail | null;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}
type CustomErrors = {
    isValid: boolean;
    description: string | null;
};

function MailForm({
    onUpdate,
    currentMail,
    setIsLoaderOpened,
    isLoaderOpened,
}: MailFormProps) {
    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        description: null,
    });
    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            description: null,
        };

        if (
            !!formData.get("description") &&
            !!currentMail &&
            !!currentMail?.constructions &&
            !!currentMail.constructions.length
        ) {
            for (const construction of currentMail.constructions) {
                if (
                    String(formData.get("description")).indexOf(
                        construction
                    ) === -1
                ) {
                    errors.description = "Укажите обязательные конструкции";
                }
            }
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
            name: yup.string().required("Это обязательное поле"),
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
        const customResult = await vaildateWithoutYup(formData);
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }
        const mailData = {
            slug: currentMail!.slug,
            name: String(formData.get("name")),
            subject: String(formData.get("subject")),
            description: String(formData.get("description")),
        };

        onUpdate(mailData);
    };

    if (!currentMail) return <Loader />;

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Редактировать шаблон письма
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
                            defaultValue={currentMail.name}
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
                            defaultValue={currentMail.subject}
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
                        {!!currentMail.constructions &&
                            currentMail.constructions.length > 0 && (
                                <p className="mb-1 text-xs text-slate-500">
                                    Вам обязательно необходимо указать следующие
                                    конструкции:{" "}
                                    {currentMail.constructions.map(
                                        (c, index) =>
                                            c +
                                            (index <
                                            currentMail.constructions.length - 1
                                                ? ", "
                                                : "")
                                    )}
                                </p>
                            )}
                        <FormTextarea
                            {...register("description")}
                            id="validation-form-description"
                            name="description"
                            className={clsx("min-h-40", {
                                "border-danger":
                                    errors.description ||
                                    customErrors.description,
                            })}
                            onChange={(e) => {
                                trigger("description");
                                setCustomErrors({
                                    ...customErrors,
                                    description: null,
                                });
                            }}
                            placeholder="Содержимое"
                            defaultValue={currentMail.description}
                        />
                        {errors.description ? (
                            <div className="mt-2 text-danger">
                                {typeof errors.description.message ===
                                    "string" && errors.description.message}
                            </div>
                        ) : (
                            customErrors.description && (
                                <div className="mt-2 text-danger">
                                    {customErrors.description}
                                </div>
                            )
                        )}
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-5"
                    >
                        Обновить
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
