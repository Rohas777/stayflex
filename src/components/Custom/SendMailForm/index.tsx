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
import { SendMail } from "@/stores/reducers/mails/types";
import { IUser } from "@/stores/models/IUser";

interface SendMailFormProps {
    onSend: (mailData: SendMail) => void;
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
    const [selectedUserID, setSelectedUserID] = useState<string>("-1");
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        user: null,
    });
    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            user: null,
        };
        if (selectedUserID === "-1" || !selectedUser) {
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
            user_mail: selectedUser!.mail,
            subject: String(formData.get("subject")),
            description: String(formData.get("description")),
        };

        onSend(mailData);
    };

    useEffect(() => {
        dispatch(fetchUsers());
    }, []);

    useEffect(() => {
        if (selectedUserID === "-1") return;

        setSelectedUser(
            users.find((user) => user.id === Number(selectedUserID))!
        );
    }, [selectedUserID]);

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
                                value={selectedUserID}
                                name="user"
                                onChange={(e) => {
                                    setSelectedUserID(e.target.value);
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
                                        {user.fullname}: {user.mail}
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

export default SendMailForm;
