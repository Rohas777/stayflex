import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    FormLabel,
    FormInput,
    InputGroup,
    FormTextarea,
} from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import {
    TariffCreateType,
    TariffUpdateType,
} from "@/stores/reducers/tariffs/types";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { useAppSelector } from "@/stores/hooks";
import TomSelect from "@/components/Base/TomSelect";
import Lucide from "@/components/Base/Lucide";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { IconType } from "@/vars";
import * as lucideIcons from "lucide-react";

interface TariffFormProps {
    isCreate: boolean;
    onCreate: (tariffData: TariffCreateType) => void;
    onUpdate: (tariffData: TariffUpdateType) => void;
}
type CustomErrors = {
    isValid: boolean;
    icon: string | null;
};
function TariffForm({ isCreate, onCreate, onUpdate }: TariffFormProps) {
    const { tariffById, statusByID, isCreated, error } = useAppSelector(
        (state) => state.tariff
    );
    const [isLoaderOpen, setIsLoaderOpen] = useState(false);
    const [iconValue, setIconValue] = useState<string | null>(null);

    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        icon: null,
    });
    const icons = lucideIcons.icons;

    const vaildateWithoutYup = (formData: FormData) => {
        const errors: CustomErrors = {
            isValid: true,
            icon: null,
        };
        if (!(String(formData.get("icon")) in icons)) {
            errors.icon = "Такой иконки не существует";
        }
        if (!formData.get("icon")) {
            errors.icon = "Обязательно укажите код иконки";
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
            object_count: yup
                .number()
                .typeError("Количество объектов должно быть числовым значением")
                .positive("Количество объектов не может быть отрицательным")
                .integer("Количество объектов должно быть целым числом")
                .moreThan(0, "Минимальное количество объектов: 1")
                .required("'Количество объектов' это обязательное поле"),
            daily_price: yup
                .number()
                .typeError("Стоимость должна быть числовым значением")
                .positive("Стоимость не может быть отрицательной")
                .integer("Стоимость должна быть целым числом")
                .moreThan(0, "Минимальная стоимость: 1")
                .required("'Стоимость в день' это обязательное поле"),
            description: yup
                .string()
                .required("'Описание' это обязательное поле"),
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
        const customResult = vaildateWithoutYup(formData);
        const result = await trigger();
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpen);
            return;
        }
        const tariffData: TariffCreateType = {
            name: String(formData.get("name")),
            daily_price: Number(formData.get("daily_price")),
            object_count: Number(formData.get("object_count")),
            description: String(formData.get("description")),
            icon: String(formData.get("icon")),
        };

        if (isCreate) {
            onCreate(tariffData);
        } else {
            const tariffUpdateData: TariffUpdateType = {
                ...tariffData,
                id: tariffById?.id!,
            };
            onUpdate(tariffUpdateData);
        }
    };

    useEffect(() => {
        if (statusByID === Status.ERROR) {
            stopLoader(setIsLoaderOpen);
            console.log(error);
        }
        if (statusByID === Status.SUCCESS && !isCreate) {
            setIconValue(tariffById?.icon ? tariffById?.icon : "");
        }
    }, [isCreated, statusByID]);

    if (statusByID === Status.LOADING && !isCreate) {
        return (
            <>
                <div className="w-full h-screen relative">
                    <div className="absolute inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {isLoaderOpen && (
                <div className="fixed inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                    <div className="w-10 h-10">
                        <LoadingIcon icon="ball-triangle" />
                    </div>
                </div>
            )}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    {isCreate ? "Добавить" : "Редактировать"} тариф
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Иконка
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div
                            className={clsx("flex items-center gap-2", {
                                "rounded-md border border-danger":
                                    customErrors.icon,
                            })}
                        >
                            {iconValue && iconValue in icons && (
                                <Lucide icon={iconValue as IconType} />
                            )}
                            <FormInput
                                id="validation-form-icon"
                                type="text"
                                name="icon"
                                onChange={(e) => {
                                    setIconValue(e.target.value);
                                    setCustomErrors((prev) => ({
                                        ...prev,
                                        icon: null,
                                    }));
                                }}
                                defaultValue={
                                    !isCreate ? tariffById?.icon : undefined
                                }
                                placeholder="CreditCard"
                            />
                        </div>
                        {customErrors.icon && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.icon === "string" &&
                                    customErrors.icon}
                            </div>
                        )}
                    </div>
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
                            defaultValue={
                                !isCreate ? tariffById?.name : undefined
                            }
                            placeholder="Название"
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
                            htmlFor="validation-form-object_count"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Количество объектов
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormInput
                            {...register("object_count")}
                            id="validation-form-object_count"
                            type="number"
                            name="object_count"
                            className={clsx({
                                "border-danger": errors.object_count,
                            })}
                            defaultValue={
                                !isCreate ? tariffById?.object_count : undefined
                            }
                            placeholder="50"
                        />
                        {errors.object_count && (
                            <div className="mt-2 text-danger">
                                {typeof errors.object_count.message ===
                                    "string" && errors.object_count.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-daily_price"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Стоимость в день
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <InputGroup className="mt-2">
                            <FormInput
                                {...register("daily_price")}
                                id="validation-form-daily_price"
                                type="number"
                                name="daily_price"
                                defaultValue={
                                    !isCreate
                                        ? tariffById?.daily_price
                                        : undefined
                                }
                                className={clsx({
                                    "border-danger-important":
                                        errors.daily_price,
                                })}
                                placeholder="50"
                            />
                            <InputGroup.Text>₽</InputGroup.Text>
                        </InputGroup>
                        {errors.daily_price && (
                            <div className="mt-2 text-danger">
                                {typeof errors.daily_price.message ===
                                    "string" && errors.daily_price.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-description"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Описание
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <FormTextarea
                            {...register("description")}
                            id="validation-form-description"
                            name="description"
                            defaultValue={
                                !isCreate ? tariffById?.description : undefined
                            }
                            className={clsx({
                                "border-danger-important": errors.description,
                            })}
                            placeholder="50"
                        ></FormTextarea>
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
                        {isCreate ? "Добавить" : "Обновить"}
                    </Button>
                </form>
            </div>
        </>
    );
}

export default TariffForm;
