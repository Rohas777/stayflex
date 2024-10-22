import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { UserCreateType, UserUpdateType } from "@/stores/reducers/users/types";
import PhoneInput from "react-phone-input-2";
import ru from "react-phone-input-2/lang/ru.json";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import { Tab } from "@/components/Base/Headless";

interface UserUpdateFormProps {
    onUpdate: (userData: UserUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}
type CustomErrors = {
    isValid: boolean;
    tel: string | null;
};

function UserUpdateForm({
    onUpdate,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserUpdateFormProps) {
    const [tel, setTel] = useState<string>();
    const [maskLengthValidation, setMaskLengthValidation] = useState(false);

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        tel: null,
    });
    const { userOne, statusOne } = useAppSelector((state) => state.user);

    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            tel: null,
        };

        if (maskLengthValidation) {
            errors.tel = "Введите корректный номер телефона";
        }
        if (!tel) {
            errors.tel = "Обязательно введите телефон пользователя";
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
            name: yup.string().required("'Название' это обязательное поле"),
            email: yup
                .string()
                .email("Введите корректный email")
                .required("'Email' это обязательное поле"),
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
        const formData = new FormData(event.target);
        const result = await trigger();
        const customResult = await vaildateWithoutYup();
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpen);
            return;
        }

        const userData: UserUpdateType = {
            fullname: String(formData.get("name")),
            mail: String(formData.get("email")),
            phone: tel!,
            id: userOne!.id,
        };
        onUpdate(userData);
    };

    useEffect(() => {
        if (statusOne !== Status.SUCCESS || !userOne) return;
        setTel(userOne.phone);
    }, [statusOne, userOne]);

    return (
        <>
            <form className="validate-form mt-5" onSubmit={onSubmit}>
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
                        {...register("name")}
                        id="validation-form-name"
                        type="text"
                        name="name"
                        className={clsx({
                            "border-danger": errors.name,
                        })}
                        placeholder="Иванов И.И."
                        defaultValue={userOne?.fullname}
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
                        htmlFor="validation-form-tel"
                        className="flex flex-col w-full sm:flex-row"
                    >
                        Номер телефона клиента
                        <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Обязательное
                        </span>
                    </FormLabel>
                    <div className="custom-phone-input relative">
                        <PhoneInput
                            country="ru"
                            localization={ru}
                            value={tel}
                            onChange={(value, country, e, formattedValue) => {
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
                            }}
                            inputClass={clsx({
                                "border-danger-important": customErrors.tel,
                            })}
                            inputProps={{
                                id: "validation-form-tel",
                            }}
                            isValid={(value, country, formattedValue) => {
                                const typedCountry = country as {
                                    countryCode: string;
                                    dialCode: string;
                                    format: string;
                                    name: string;
                                };
                                const maskLength = typedCountry.format
                                    .split("")
                                    .filter((char) => char === ".").length;
                                setMaskLengthValidation(
                                    maskLength != value.length
                                );
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
                        {...register("email")}
                        id="validation-form-email"
                        type="text"
                        name="email"
                        className={clsx({
                            "border-danger": errors.email,
                        })}
                        placeholder="example@ex.com"
                        defaultValue={userOne?.mail}
                    />
                    {errors.email && (
                        <div className="mt-2 text-danger">
                            {typeof errors.email.message === "string" &&
                                errors.email.message}
                        </div>
                    )}
                </div>
                <Button type="submit" variant="primary" className="w-full mt-5">
                    Обновить
                </Button>
            </form>
        </>
    );
}

export default UserUpdateForm;
