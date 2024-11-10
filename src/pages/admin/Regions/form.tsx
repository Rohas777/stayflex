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
import { RegionCreateType } from "@/stores/reducers/regions/types";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { startLoader, stopLoader } from "@/utils/customUtils";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import { IServer } from "@/stores/models/IServer";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchServers } from "@/stores/reducers/servers/actions";
import Loader from "@/components/Custom/Loader/Loader";
import { Status } from "@/stores/reducers/types";

interface RegionFormProps {
    onCreate: (name: RegionCreateType) => void;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}

type CustomErrors = {
    isValid: boolean;
    server: string | null;
};
function RegionForm({
    onCreate,
    setIsLoaderOpened,
    isLoaderOpened,
}: RegionFormProps) {
    const [select, setSelect] = useState("-1");
    const [showValidationNotification, setShowValidationNotification] =
        useState(false);

    const { servers, status, error } = useAppSelector((state) => state.server);

    const dispatch = useAppDispatch();
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        server: null,
    });

    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            server: null,
        };
        if (select === "-1") {
            errors.server = "Обязательно выберите сервер";
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
        const customResult = await vaildateWithoutYup();
        startLoader(setIsLoaderOpened);
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }

        const formData = new FormData(event.target);
        const region: RegionCreateType = {
            name: String(formData.get("name")),
            server_id: Number(select),
        };
        onCreate(region);
    };

    useEffect(() => {
        dispatch(fetchServers());
    }, []);

    useEffect(() => {
        if (status !== Status.SUCCESS) return;
        const defaultServer = servers.find((server) => server.default);
        setSelect(defaultServer ? String(defaultServer.id) : "-1");
    }, [servers, status]);

    if (status === Status.LOADING && !isLoaderOpened) return <Loader />;

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить регион
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Название
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
                        />
                        {errors.name && (
                            <div className="mt-2 text-danger">
                                {typeof errors.name.message === "string" &&
                                    errors.name.message}
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <FormLabel
                            htmlFor="validation-form-server"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Сервер
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div
                            className={clsx("border rounded-md", {
                                "border-danger": customErrors.server,
                            })}
                        >
                            <TomSelect
                                id="validation-form-server"
                                value={select}
                                name="server"
                                onChange={(e) => {
                                    setSelect(e.target.value);
                                }}
                                options={{
                                    controlInput: undefined,
                                    searchField: undefined,
                                }}
                                className="w-full"
                            >
                                {servers.map((server) => (
                                    <option key={server.id} value={server.id}>
                                        {server.name}
                                    </option>
                                ))}
                            </TomSelect>
                        </div>
                        {customErrors.server && (
                            <div className="mt-2 text-danger">
                                {customErrors.server}
                            </div>
                        )}
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
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default RegionForm;
