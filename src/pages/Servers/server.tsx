import AccordionWithSwitcher from "../../components/Base/AccordionWithSwitcher";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";

type ServerProps = {
    checked?: boolean;
    data: {
        name: string;
        ip: string;
        login: string;
        password: string;
    };
};

function Server({ data, checked = true }: ServerProps) {
    const schema = yup
        .object({
            name: yup.string().required(),
            ip: yup.string().required(),
            login: yup.string().required(),
            password: yup.string().required(),
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
        const result = await trigger();
        if (!result) {
            const failedEl = document
                .querySelectorAll("#failed-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            failedEl.classList.remove("hidden");
            Toastify({
                node: failedEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        } else {
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
    };

    return (
        <>
            <AccordionWithSwitcher title={data.name} checked>
                <form className="validate-form" onSubmit={onSubmit}>
                    <div className="grid grid-cols-12 gap-10">
                        <div className="input-form col-span-6">
                            <FormLabel
                                htmlFor="validation-form-1"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Имя
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("name")}
                                id="validation-form-1"
                                type="text"
                                name="name"
                                defaultValue={data.name}
                                className={clsx({
                                    "border-danger": errors.name,
                                })}
                                placeholder="Name"
                            />
                            {errors.name && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.name.message === "string" &&
                                        errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form col-span-6">
                            <FormLabel
                                htmlFor="validation-form-2"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                IP
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("ip")}
                                id="validation-form-2"
                                type="text"
                                name="ip"
                                defaultValue={data.ip}
                                className={clsx({
                                    "border-danger": errors.ip,
                                })}
                                placeholder="IP"
                            />
                            {errors.ip && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.ip.message === "string" &&
                                        errors.ip.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 grid grid-cols-12 gap-10">
                        <div className="col-span-6 input-form">
                            <FormLabel
                                htmlFor="validation-form-4"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Логин
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("login")}
                                id="validation-form-4"
                                type="text"
                                name="login"
                                defaultValue={data.login}
                                className={clsx({
                                    "border-danger": errors.login,
                                })}
                                placeholder="Login"
                            />
                            {errors.login && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.login.message === "string" &&
                                        errors.login.message}
                                </div>
                            )}
                        </div>
                        <div className="col-span-6 input-form">
                            <FormLabel
                                htmlFor="validation-form-3"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Пароль
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("password")}
                                id="validation-form-3"
                                type="text"
                                name="password"
                                defaultValue={data.password}
                                className={clsx({
                                    "border-danger": errors.password,
                                })}
                                placeholder="Password"
                            />
                            {errors.password && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.password.message ===
                                        "string" && errors.password.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        className="block ml-auto mt-5"
                    >
                        Сохранить
                    </Button>
                </form>
            </AccordionWithSwitcher>
        </>
    );
}

export default Server;
