import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { AmenityCreateType } from "@/stores/reducers/amenities/types";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import * as lucideIcons from "lucide-react";
import { IconType } from "@/vars";
import Lucide from "@/components/Base/Lucide";

interface AmenityFormProps {
    onCreate: (amenityData: AmenityCreateType) => void;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}

interface CustomErrors {
    isValid: boolean;
    icon: string | null;
}

function AmenityForm({
    onCreate,
    setIsLoaderOpened,
    isLoaderOpened,
}: AmenityFormProps) {
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
        const customResult = vaildateWithoutYup(formData);
        if (!result || !customResult.isValid) {
            stopLoader(setIsLoaderOpened);
            return;
        }
        const amenityData: AmenityCreateType = {
            name: String(formData.get("name")),
            icon: String(formData.get("icon")) as IconType,
        };

        onCreate(amenityData);
    };

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить удобство
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
                            htmlFor="validation-form-icon"
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
                                placeholder="Tv"
                            />
                        </div>
                        {customErrors.icon && (
                            <div className="mt-2 text-danger">
                                {typeof customErrors.icon === "string" &&
                                    customErrors.icon}
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
        </>
    );
}

export default AmenityForm;
