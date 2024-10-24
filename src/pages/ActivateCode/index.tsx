import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import Lucide from "@/components/Base/Lucide";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CodeCredentials,
    SignInCredentials,
} from "@/stores/reducers/auth/types";
import { activate, auth, signIn } from "@/stores/reducers/auth/actions";
import { Status } from "@/stores/reducers/types";
import { authSlice } from "@/stores/reducers/auth/slice";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

function Main() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoaderOpen, setIsLoaderOpen] = useState(false);

    const [isSignUp, setIsSignUp] = useState(
        location.pathname === "/register/activate"
    );

    const { codeStatus, signInStatus, signUpStatus, authTempUser, error } =
        useAppSelector((state) => state.auth);
    const authActions = authSlice.actions;

    const schema = yup
        .object({
            code: yup.string().required("Вам необходимо ввести код"),
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

        const authData: CodeCredentials = {
            mail: authTempUser.mail,
            code: String(formData.get("code")),
        };

        if (!isSignUp) {
            dispatch(auth(authData));
        } else {
            dispatch(activate(authData));
        }
    };

    useEffect(() => {
        if (signInStatus !== Status.SUCCESS && !isSignUp) {
            navigate("/login");
        }
        if (signUpStatus !== Status.SUCCESS && isSignUp) {
            navigate("/register");
        }
        if (codeStatus === Status.SUCCESS) {
            navigate("/");
            stopLoader(setIsLoaderOpen);
        }
    }, [codeStatus, signInStatus, signUpStatus, isSignUp]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div
                className={clsx([
                    "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <ThemeSwitcher />
                <div className="container relative z-10 sm:px-10">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: Login Info */}
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
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-1/2 -mt-16 -intro-x"
                                    src={illustrationUrl}
                                />
                                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                                    На ваш email отправлено
                                    <br />
                                    уведомлние с кодом
                                    <br />о подтверждении.
                                </div>
                                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                                    Пожалуйста, введите код.
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <form
                            onSubmit={onSignIn}
                            className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0"
                        >
                            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Подтвердить вход
                                </h2>
                                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                                    На ваш email отправлено уведомлние с кодом о
                                    подтверждении. Пожалуйста, введите код.
                                </div>
                                <div className="mt-8 intro-x">
                                    <FormInput
                                        {...register("code")}
                                        type="text"
                                        name="code"
                                        className={clsx(
                                            "block px-4 py-3 intro-x min-w-full xl:min-w-[350px]",
                                            {
                                                "border-danger": errors.code,
                                            }
                                        )}
                                        placeholder="Ваш код"
                                    />
                                    {errors.code && (
                                        <div className="mt-2 text-danger">
                                            {typeof errors.code.message ===
                                                "string" && errors.code.message}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                                    <Button
                                        variant="primary"
                                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                                        type="submit"
                                    >
                                        Продолжить
                                    </Button>
                                </div>
                                <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                                    Регистрируясь, вы соглашаетесь с нашими{" "}
                                    <a
                                        className="text-primary dark:text-slate-200"
                                        href=""
                                    >
                                        условиями использования
                                    </a>{" "}
                                    и{" "}
                                    <a
                                        className="text-primary dark:text-slate-200"
                                        href=""
                                    >
                                        политикой конфиденциальности
                                    </a>
                                    .
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
