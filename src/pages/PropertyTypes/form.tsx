import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useState } from "react";
import TomSelect from "@/components/Base/TomSelect";
import { RegionCreateType } from "@/stores/reducers/regions/types";
import { PropertyTypeCreateType } from "@/stores/reducers/property-types/types";

interface PropertyTypeFormProps {
    isCreate: boolean;
    onCreate: (name: RegionCreateType) => void;
    onUpdate: (name: RegionCreateType) => void;
    propertyTypeName: string;
}

function PropertyTypeForm({
    isCreate,
    onCreate,
    onUpdate,
    propertyTypeName,
}: PropertyTypeFormProps) {
    const schema = yup
        .object({
            name: yup.string().required(),
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
            return;
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
            const formData = new FormData(event.target);
            const propertyType: PropertyTypeCreateType = {
                name: String(formData.get("name")),
            };
            if (isCreate) {
                onCreate(propertyType);
            } else {
                onUpdate(propertyType);
            }
        }
    };

    return (
        <>
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    {isCreate ? "Добваить" : "Редактировать"} тип недвижимости
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
                            defaultValue={
                                !isCreate ? propertyTypeName : undefined
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

export default PropertyTypeForm;
