import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import ru from "react-phone-input-2/lang/ru.json";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Lucide from "@/components/Base/Lucide";
import { SignUpCredentials } from "@/stores/reducers/auth/types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { signUp } from "@/stores/reducers/auth/actions";
import { Status } from "@/stores/reducers/types";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import Loader from "@/components/Custom/Loader/Loader";
import { setErrorToast } from "@/stores/errorToastSlice";
import { authSlice } from "@/stores/reducers/auth/slice";

type CustomErrors = {
    isValid: boolean;
    tel: string | null;
    terms: string | null;
    confirmPassword: string | null;
};
function Main() {
    const [tel, setTel] = useState<string>("");
    const [maskLengthValidation, setMaskLengthValidation] = useState(false);
    const [password, setPassword] = useState<string>("");
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [passwordSecure, setPasswordSecure] = useState<
    //     "bad" | "good" | "strong" | null
    // >(null);

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        tel: null,
        terms: null,
        confirmPassword: null,
    });

    const { signUpStatus, error } = useAppSelector((state) => state.auth);
    const { authorizedUser, authorizedUserStatus } = useAppSelector(
        (state) => state.user
    );
    const authActions = authSlice.actions;
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const vaildateWithoutYup = async (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            tel: null,
            terms: null,
            confirmPassword: null,
        };

        if (maskLengthValidation) {
            errors.tel = "Введите корректный номер телефона";
        }
        if (!tel) {
            errors.tel = "Вам необходимо ввести ваш номер телефона";
        }
        if (isTermsChecked === false) {
            errors.terms =
                "Для продолжения вам необходимо согласиться с условиями";
        }
        if (password !== formData.get("confirmPassword")) {
            errors.confirmPassword = "Пароли не совпадают";
        }
        if (!String(formData.get("confirmPassword")).length) {
            errors.confirmPassword = "Пароли не совпадают";
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
            name: yup
                .string()
                .required("Вам необходимо ввести ваши фамилию и инициалы"),
            email: yup
                .string()
                .email("Введите корректный email")
                .required("Вам необходимо ввести ваш email"),
            password: yup
                .string()
                .matches(
                    /[a-zA-Z\d]/,
                    "Пароль должен содержать только латинские буквы и цифры"
                )
                .min(8, "Пароль должен содержать не менее 8 символов")
                .required("Вам необходимо ввести пароль"),
            terms: yup
                .boolean()
                .oneOf(
                    [true],
                    "Для продолжения вам необходимо согласиться с условиями"
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

    const onSignUp = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        startLoader(setIsLoaderOpen);
        const formData = new FormData(event.target);
        const result = await trigger();
        const customResult = await vaildateWithoutYup(formData);
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpen);
            return;
        }

        const signUpData: SignUpCredentials = {
            mail: String(formData.get("email")),
            password: String(formData.get("password")),
            fullname: String(formData.get("name")),
            phone: tel,
            tariff_id: 1, //FIXME -
        };

        dispatch(signUp(signUpData));
    };

    useEffect(() => {
        if (authorizedUserStatus !== Status.LOADING) {
            setIsLoading(false);
        }
        if (!!authorizedUser && authorizedUser.is_admin) {
            navigate("/admin/");
        }
        if (!!authorizedUser && !authorizedUser.is_admin) {
            navigate("/");
        }
    }, [authorizedUserStatus, authorizedUser]);

    useEffect(() => {
        if (signUpStatus === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            dispatch(setErrorToast({ message: error!, isError: true }));
            dispatch(authActions.resetStatus());
        }
        if (signUpStatus === Status.SUCCESS) {
            stopLoader(setIsLoaderOpen);
            navigate("/register/activate");
        }
    }, [signUpStatus]);

    if (isLoading) {
        return <Loader className="w-full h-screen bg-primary" />;
    }

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div
                className={clsx([
                    "p-3 sm:px-8 relative xl:h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <ThemeSwitcher />
                <div className="container relative z-10 sm:px-10">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: Register Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a
                                href=""
                                className="flex items-center pt-5 -intro-x"
                            >
                                <img
                                    alt="Stayflex"
                                    className="w-32"
                                    src={logoUrl}
                                />
                            </a>
                            <div className="my-auto w-96">
                                <img
                                    alt="Stayflex"
                                    className="w-3/4 -mt-16 -intro-x"
                                    src={illustrationUrl}
                                />
                                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                                    Осталось всего пара кликов, чтобы
                                    зарегистрировать свою учетную запись.
                                </div>
                            </div>
                        </div>
                        {/* END: Register Info */}
                        {/* BEGIN: Register Form */}
                        <form
                            onSubmit={onSignUp}
                            className="flex h-auto py-5 my-10 xl:py-0 xl:my-0"
                        >
                            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Зарегистрироваться
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                                    Осталось несколько кликов, чтобы
                                    зарегистрировать свою учетную запись.
                                </div>
                                <div className="mt-8 intro-x">
                                    <FormInput
                                        {...register("name")}
                                        name="name"
                                        type="text"
                                        placeholder="ФИО: Иванов И.И."
                                        className={clsx(
                                            "block px-4 py-3 intro-x min-w-full xl:min-w-[350px]",
                                            {
                                                "border-danger": errors.name,
                                            }
                                        )}
                                    />
                                    {errors.name && (
                                        <div className="mt-2 text-danger">
                                            {typeof errors.name.message ===
                                                "string" && errors.name.message}
                                        </div>
                                    )}
                                    <div className="custom-phone-input relative h-12 mt-3 z-50">
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
                                                const typedCountry =
                                                    country as {
                                                        countryCode: string;
                                                        dialCode: string;
                                                        format: string;
                                                        name: string;
                                                    };
                                            }}
                                            inputClass={clsx("h-12", {
                                                "border-danger-important":
                                                    customErrors.tel,
                                            })}
                                            inputProps={{
                                                id: "validation-form-tel",
                                            }}
                                            isValid={(
                                                value,
                                                country,
                                                formattedValue
                                            ) => {
                                                const typedCountry =
                                                    country as {
                                                        countryCode: string;
                                                        dialCode: string;
                                                        format: string;
                                                        name: string;
                                                    };
                                                const maskLength =
                                                    typedCountry.format
                                                        .split("")
                                                        .filter(
                                                            (char) =>
                                                                char === "."
                                                        ).length;
                                                setMaskLengthValidation(
                                                    maskLength != value.length
                                                );
                                                return true;
                                            }}
                                        />
                                    </div>
                                    {customErrors.tel && (
                                        <div className="mt-2 text-danger">
                                            {typeof customErrors.tel ===
                                                "string" && customErrors.tel}
                                        </div>
                                    )}
                                    <FormInput
                                        {...register("email")}
                                        name="email"
                                        type="text"
                                        placeholder="Email"
                                        className={clsx(
                                            "block px-4 py-3 mt-3 intro-x min-w-full xl:min-w-[350px]",
                                            {
                                                "border-danger": errors.email,
                                            }
                                        )}
                                    />

                                    {errors.email && (
                                        <div className="mt-2 text-danger">
                                            {typeof errors.email.message ===
                                                "string" &&
                                                errors.email.message}
                                        </div>
                                    )}
                                    <div className="relative mt-3">
                                        <Lucide
                                            icon={
                                                showPassword ? "EyeOff" : "Eye"
                                            }
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="w-6 h-6 absolute top-2/4 -translate-y-2/4 mr-3 right-0 z-50 cursor-pointer text-slate-500 dark:text-slate-400"
                                        />
                                        <FormInput
                                            {...register("password")}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            className={clsx(
                                                "block px-4 py-3 intro-x min-w-full xl:min-w-[350px]",
                                                {
                                                    "border-danger":
                                                        errors.password,
                                                }
                                            )}
                                            placeholder="Пароль"
                                            value={password}
                                            onChange={async (e) => {
                                                setPassword(e.target.value);
                                                // await trigger();
                                                // checkPasswordSecurity(
                                                //     e.target.value
                                                // );
                                            }}
                                        />
                                    </div>
                                    {errors.password && (
                                        <div className="mt-2 text-danger">
                                            {typeof errors.password.message ===
                                                "string" &&
                                                errors.password.message}
                                        </div>
                                    )}
                                    {/* {passwordSecure !== null && (
                                        <>
                                            <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3 intro-x">
                                                {passwordSecure === "bad" && (
                                                    <div className="h-full col-span-4 rounded bg-danger"></div>
                                                )}
                                                {passwordSecure === "good" && (
                                                    <>
                                                        <div className="h-full col-span-4 rounded bg-pending"></div>
                                                        <div className="h-full col-span-4 rounded bg-pending"></div>
                                                    </>
                                                )}
                                                {passwordSecure ===
                                                    "strong" && (
                                                    <>
                                                        <div className="h-full col-span-4 rounded bg-success"></div>
                                                        <div className="h-full col-span-4 rounded bg-success"></div>
                                                        <div className="h-full col-span-4 rounded bg-success"></div>
                                                    </>
                                                )}
                                            </div>
                                            <p className="block mt-2 text-xs intro-x text-slate-500 sm:text-sm">
                                                {passwordSecure === "bad" && (
                                                    <span className="text-danger">
                                                        Слабый пароль
                                                    </span>
                                                )}
                                                {passwordSecure === "good" && (
                                                    <span className="text-pending">
                                                        Хороший пароль
                                                    </span>
                                                )}
                                                {passwordSecure ===
                                                    "strong" && (
                                                    <span className="text-success">
                                                        Сильный пароль
                                                    </span>
                                                )}
                                            </p>
                                        </>
                                    )} */}

                                    <div className="relative mt-3">
                                        <Lucide
                                            icon={
                                                showPassword ? "EyeOff" : "Eye"
                                            }
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="w-6 h-6 absolute top-2/4 -translate-y-2/4 mr-3 right-0 z-50 cursor-pointer text-slate-500 dark:text-slate-400"
                                        />
                                        <FormInput
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={() => {
                                                setCustomErrors((prev) => ({
                                                    ...prev,
                                                    confirmPassword: null,
                                                }));
                                            }}
                                            name="confirmPassword"
                                            className={clsx(
                                                "block px-4 py-3 intro-x min-w-full xl:min-w-[350px]",
                                                {
                                                    "border-danger":
                                                        customErrors.confirmPassword,
                                                }
                                            )}
                                            placeholder="Подтвердите пароль"
                                        />
                                    </div>
                                    {customErrors.confirmPassword && (
                                        <div className="mt-2 text-danger">
                                            {typeof customErrors.confirmPassword ===
                                                "string" &&
                                                customErrors.confirmPassword}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
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
                                            href=""
                                        >
                                            политики конфиденциальности
                                        </a>
                                        .
                                    </label>
                                </div>
                                {customErrors.terms && (
                                    <div className="mt-2 text-danger">
                                        {typeof customErrors.terms ===
                                            "string" && customErrors.terms}
                                    </div>
                                )}
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full px-4 py-3 align-top xl:w-44 xl:mr-3"
                                    >
                                        Зарегистрироваться
                                    </Button>
                                    <Link to="/login">
                                        <Button
                                            variant="outline-secondary"
                                            className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                                        >
                                            Войти
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                        {/* END: Register Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
