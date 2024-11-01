import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import Lucide from "@/components/Base/Lucide";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignInCredentials } from "@/stores/reducers/auth/types";
import { signIn } from "@/stores/reducers/auth/actions";
import { Status } from "@/stores/reducers/types";
import { authSlice } from "@/stores/reducers/auth/slice";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { startLoader, stopLoader } from "@/utils/customUtils";
import Loader from "@/components/Custom/Loader/Loader";
import { errorToastSlice } from "@/stores/errorToastSlice";

function Main() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { signInStatus, error } = useAppSelector((state) => state.auth);
    const { authorizedUser, authorizedUserStatus } = useAppSelector(
        (state) => state.user
    );
    const authActions = authSlice.actions;
    const { setErrorToast } = errorToastSlice.actions;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const schema = yup
        .object({
            email: yup
                .string()
                .email("Введите корректный email")
                .required("Вам необходимо ввести email"),
            password: yup.string().required("Вам необходимо ввести пароль"),
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

    const onSignIn = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        startLoader(setIsLoaderOpen);
        const formData = new FormData(event.target);
        const result = await trigger();
        if (!result) {
            stopLoader(setIsLoaderOpen);
            return;
        }

        const signInData: SignInCredentials = {
            mail: String(formData.get("email")),
            password: String(formData.get("password")),
        };

        dispatch(signIn(signInData));
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
        if (signInStatus === Status.SUCCESS) {
            stopLoader(setIsLoaderOpen);
            navigate("/login/auth");
        }
        if (signInStatus === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            dispatch(setErrorToast({ message: error!, isError: true }));
            dispatch(authActions.resetStatus());
        }
    }, [signInStatus]);

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
                        {/* BEGIN: Login Info */}
                        <img
                            alt="Stayflex"
                            className="mx-auto mt-4 w-32 xl:hidden"
                            src={logoUrl}
                        />
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
                                    Осталось несколько кликов, чтобы войти в
                                    свою учетную запись.
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <form
                            onSubmit={onSignIn}
                            className="flex min-h-screen w-full xl:h-screen py-5 xl:py-0 xl:my-0"
                        >
                            <div className="w-full flex-grow px-5 py-8 mb-auto xl:my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Войти
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                                    Осталось несколько кликов, чтобы войти в
                                    свою учетную запись.
                                </div>
                                <div className="mt-8 intro-x">
                                    <FormInput
                                        {...register("email")}
                                        type="text"
                                        name="email"
                                        className={clsx(
                                            "block px-4 py-3 intro-x min-w-full xl:min-w-[350px]",
                                            {
                                                "border-danger": errors.email,
                                            }
                                        )}
                                        placeholder="Email"
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
                                        />
                                    </div>
                                    {errors.password && (
                                        <div className="mt-2 text-danger">
                                            {typeof errors.password.message ===
                                                "string" &&
                                                errors.password.message}
                                        </div>
                                    )}
                                </div>
                                {/* <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                                    <div className="flex items-center mr-auto">
                                        <FormCheck.Input
                                            id="remember-me"
                                            type="checkbox"
                                            className="mr-2 border"
                                        />
                                        <label
                                            className="cursor-pointer select-none"
                                            htmlFor="remember-me"
                                        >
                                            Запомнить меня
                                        </label>
                                    </div>
                                    <a href="">Забыли пароль?</a>
                                </div> */}
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                    <Button
                                        variant="primary"
                                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        type="submit"
                                    >
                                        Войти
                                    </Button>
                                    <Link to="/register">
                                        <Button
                                            variant="outline-secondary"
                                            className="w-full px-4 py-3 mt-3 align-top xl:w-44 xl:mt-0"
                                        >
                                            Зарегистрироваться
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                        {/* END: Login Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
