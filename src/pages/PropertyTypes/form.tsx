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
import { PropertyTypeCreateType } from "@/stores/reducers/property-types/types";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

interface PropertyTypeFormProps {
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
    onCreate: (name: PropertyTypeCreateType) => void;
}

function PropertyTypeForm({
    onCreate,
    setIsLoaderOpened,
    isLoaderOpened,
}: PropertyTypeFormProps) {
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
        const result = await trigger();
        if (!result) {
            stopLoader(setIsLoaderOpened);
            return;
        }

        const formData = new FormData(event.target);
        const propertyType: PropertyTypeCreateType = {
            name: String(formData.get("name")),
        };
        onCreate(propertyType);
    };

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить тип недвижимости
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

export default PropertyTypeForm;
