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
import { fetchUsers } from "@/stores/reducers/users/actions";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";

interface SendMailFormProps {
    onSend: (mailData: any) => void;
    // onSend: (amenityData: MailCreateType) => void;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}
type CustomErrors = {
    isValid: boolean;
    user: string | null;
};

function SendMailForm({
    onSend,
    setIsLoaderOpened,
    isLoaderOpened,
}: SendMailFormProps) {
    const dispatch = useAppDispatch();
    const { users, status } = useAppSelector((state) => state.user);

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [selectedUser, setSelectedUser] = useState<string>("-1");
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        user: null,
    });
    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            user: null,
        };
        if (selectedUser === "-1") {
            errors.user = "Обязательно выберите пользователя";
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
        const customResult = await vaildateWithoutYup();
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }
        const mailData = {
            name: String(formData.get("name")),
            subject: String(formData.get("subject")),
            body: String(formData.get("body")),
        };

        onSend(mailData);
    };

    useEffect(() => {
        dispatch(fetchUsers());
    }, []);

    if (status === Status.LOADING) return <Loader />;

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
                            htmlFor="validation-form-user"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Пользователь
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div
                            className={clsx(
                                "border rounded-md border-transparent",
                                {
                                    "border-danger-important":
                                        customErrors.user,
                                }
                            )}
                        >
                            <TomSelect
                                id="validation-form-user"
                                value={selectedUser}
                                name="user"
                                onChange={(e) => {
                                    setSelectedUser(e.target.value);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        user: null,
                                    }));
                                }}
                                options={{
                                    placeholder: "Выберите пользователя",
                                }}
                                className="w-full"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullname}
                                    </option>
                                ))}
                            </TomSelect>
                        </div>
                        {customErrors.user && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.user === "string" &&
                                    customErrors.user}
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

export default SendMailForm;
