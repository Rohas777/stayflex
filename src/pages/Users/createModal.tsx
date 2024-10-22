import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import { RegionCreateType } from "@/stores/reducers/regions/types";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { UserCreateType } from "@/stores/reducers/users/types";
import PhoneInput from "react-phone-input-2";
import ru from "react-phone-input-2/lang/ru.json";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";

interface UserCreateModalProps {
    onCreate: (userData: UserCreateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}
type CustomErrors = {
    isValid: boolean;
    tel: string | null;
};

function UserCreateModal({
    onCreate,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserCreateModalProps) {
    const [tel, setTel] = useState<string>();
    const [maskLengthValidation, setMaskLengthValidation] = useState(false);
    const [isUserActive, setIsUserActive] = useState(false);
    const [isUserVerified, setIsUserVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        tel: null,
    });

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
            password: yup
                .string()
                .min(8, "Пароль слишком короткий - минимум 8 символов")
                .matches(
                    /^[a-zA-Z\d]*$/,
                    "Пароль должен содержать только цифры и латинские буквы"
                )
                .matches(
                    /^(?=.*[A-Z]).*$/,
                    "Пароль должен содержать хотя бы 1 заглавную букву"
                )
                .matches(
                    /^(?=.*[a-z]).*$/,
                    "Пароль должен содержать хотя бы 1 строчную букву"
                )
                .matches(
                    /^(?=.*\d).*$/,
                    "Пароль должен содержать хотя бы 1 цифру"
                )
                .required("'Пароль' это обязательное поле"),

            balance: yup
                .number()
                .lessThan(2147483647, "Превышено максимальное число")
                .typeError("Баланс должен быть числовым значением")
                .positive("Баланс не может быть отрицательным")
                .integer("Баланс должен быть целым числом")
                .moreThan(-1, "Минимальный баланс: 0")
                .required("'Баланс' это обязательное поле"),
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

        const userData: UserCreateType = {
            fullname: String(formData.get("name")),
            mail: String(formData.get("email")),
            phone: tel!,
            password: String(formData.get("password")),
            balance: Number(formData.get("balance")),
            is_active: isUserActive,
            is_verified: isUserVerified,
        };
        onCreate(userData);
    };

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить пользователя
                </div>
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
                            htmlFor="validation-form-email"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Пароль
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div className="relative">
                            <FormInput
                                {...register("password")}
                                id="validation-form-password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={clsx({
                                    "border-danger": errors.password,
                                })}
                                placeholder="Пароль"
                            />
                            <Lucide
                                icon={showPassword ? "EyeOff" : "Eye"}
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            />
                        </div>
                        {errors.password && (
                            <div className="mt-2 text-danger">
                                {typeof errors.password.message === "string" &&
                                    errors.password.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-balance"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Баланс
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormInput
                            {...register("balance")}
                            id="validation-form-balance"
                            type="number"
                            name="balance"
                            className={clsx({
                                "border-danger": errors.balance,
                            })}
                            placeholder="1 000"
                        />
                        {errors.balance && (
                            <div className="mt-2 text-danger">
                                {typeof errors.balance.message === "string" &&
                                    errors.balance.message}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <label
                            onChange={(e) =>
                                setIsUserActive(
                                    (e.target as HTMLInputElement).checked
                                )
                            }
                            className="inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={isUserActive}
                                className="sr-only peer"
                            />
                            <div className="mr-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            Активировать сразу?
                        </label>
                        <Tippy content="Определяет будет ли пользователен активирован сразу">
                            <Lucide icon="Info" className="cursor-help" />
                        </Tippy>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <label
                            onChange={(e) =>
                                setIsUserVerified(
                                    (e.target as HTMLInputElement).checked
                                )
                            }
                            className="inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={isUserVerified}
                                className="sr-only peer"
                            />
                            <div className="mr-3 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            Верифицировать сразу?
                        </label>
                        <Tippy content="Определяет будет ли пользователен верифицирован сразу">
                            <Lucide icon="Info" className="cursor-help" />
                        </Tippy>
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

export default UserCreateModal;
