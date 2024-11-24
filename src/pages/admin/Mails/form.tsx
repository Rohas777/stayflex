import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import { IMail } from "@/stores/models/IMail";
import Loader from "@/components/Custom/Loader/Loader";
import { UpdateMail } from "@/stores/reducers/mails/types";
import {
    Bold,
    Essentials,
    Italic,
    List,
    Mention,
    Paragraph,
    Undo,
    Heading,
    Link,
    FontSize,
} from "ckeditor5";
import CKEditorWithConstructions from "@/components/Custom/CKEditor/CKEditorWithConstructions";

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
    const [editorData, setEditorData] = useState<string>("");
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        description: null,
    });
    const editorValidationRef = useRef<HTMLDivElement>(null);

    const checkUsedConstructions = (data: string, validate = false) => {
        if (
            !data ||
            !currentMail ||
            !currentMail.constructions ||
            !currentMail.constructions.length
        )
            return false;
        for (const construction of currentMail.constructions) {
            const constructionSelectorBtn = document.querySelector(
                ".ck-button.placeholder"
            );
            const constructionSelect = document.querySelector(
                `.ck-list .construction.${construction.class}`
            );
            if (String(data).indexOf(construction.construction) !== -1) {
                constructionSelectorBtn?.classList.remove("!bg-danger/30");
                constructionSelectorBtn?.classList.add("bg-success/30");
                constructionSelect?.classList.add("!bg-success/30");
                constructionSelect?.classList.remove("!bg-danger/30");
                return true;
            }
            if (String(data).indexOf(construction.construction) === -1) {
                constructionSelectorBtn?.classList.remove("bg-success/30");
                constructionSelect?.classList.remove("!bg-success/30");
                if (validate) {
                    constructionSelectorBtn?.classList.add("!bg-danger/30");
                    constructionSelect?.classList.add("!bg-danger/30");
                    return false;
                }
            }
        }

        return true;
    };

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            description: null,
        };

        if (
            editorData &&
            !!currentMail &&
            !!currentMail.constructions &&
            !!currentMail.constructions.length
        ) {
            if (!checkUsedConstructions(editorData, true)) {
                checkUsedConstructions(editorData, true);
                errors.description = "Укажите обязательные конструкции";
            }
        }
        if (!editorData) {
            errors.description = "Это обязательное поле";
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
            description: editorData,
        };

        onUpdate(mailData);
    };

    useEffect(() => {
        checkUsedConstructions(editorData);
        setCustomErrors({ ...customErrors, description: null });
    }, [editorData, currentMail]);

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
                        <div
                            ref={editorValidationRef}
                            className={clsx(
                                "border rounded-sm border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.description,
                                }
                            )}
                            onChange={(e) => {
                                setCustomErrors({
                                    ...customErrors,
                                    description: null,
                                });
                            }}
                        >
                            <CKEditorWithConstructions
                                editorData={editorData}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditorData(data);
                                }}
                                onReady={() => {
                                    setEditorData(currentMail.description);
                                    checkUsedConstructions(
                                        currentMail.description
                                    );
                                }}
                                constructions={currentMail.constructions}
                                config={{
                                    toolbar: {
                                        items: [
                                            "heading",
                                            "fontSize",
                                            "|",
                                            "bold",
                                            "italic",
                                            "link",
                                            "numberedList",
                                            "bulletedList",
                                            "|",
                                            "undo",
                                            "redo",
                                        ],
                                    },
                                    plugins: [
                                        Bold,
                                        Essentials,
                                        Italic,
                                        Mention,
                                        Paragraph,
                                        Undo,
                                        List,
                                        Link,
                                        Heading,
                                        FontSize,
                                    ],
                                    initialData: currentMail.description,
                                }}
                            />
                        </div>
                        {customErrors.description && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.description === "string" &&
                                    customErrors.description}
                            </div>
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
