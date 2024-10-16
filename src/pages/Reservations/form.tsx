import "@/assets/css/vendors/tabulator.css";
import "@/assets/css/vendors/phoneinput.css";
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
import { ReservationCreateType } from "@/stores/reducers/reservations/types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { objectSlice } from "@/stores/reducers/objects/slice";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Litepicker from "@/components/Base/Litepicker";
import Lucide from "@/components/Base/Lucide";
import PhoneInput, { type Value as E164Number } from "react-phone-number-input";

interface ReservationFormProps {
    onCreate: (name: ReservationCreateType) => void;
}

function ReservationForm({ onCreate }: ReservationFormProps) {
    const [selectedObject, setSelectedObject] = useState("-1");
    const [daterange, setDaterange] = useState("");
    const [tel, setTel] = useState<E164Number>();

    const objectsState = useAppSelector((state) => state.object);
    const {} = objectSlice.actions;

    const dispatch = useAppDispatch();

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
            // const region: RegionCreateType = {
            //     name: String(formData.get("name")),
            // };
            // onCreate(region);
        }
    };

    if (objectsState.status === Status.LOADING) {
        return (
            <>
                <div className="w-full h-60 relative rounded-md overflow-hidden">
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
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добваить бронь
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Объект
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <TomSelect
                            value={selectedObject}
                            onChange={(e) => {
                                setSelectedObject(e.target.value);
                                // setCustomErrors((prev) => ({
                                //     ...prev,
                                //     region: null,
                                // }));
                            }}
                            options={{
                                placeholder: "Выберите регион",
                            }}
                            className="w-full"
                        >
                            {objectsState.objects.map((object) => {
                                return (
                                    <option key={object.id} value={object.id}>
                                        {object.name}
                                    </option>
                                );
                            })}
                        </TomSelect>
                        {errors.name && (
                            <div className="mt-2 text-danger">
                                {typeof errors.name.message === "string" &&
                                    errors.name.message}
                            </div>
                        )}
                    </div>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-date"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Дата
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <div className="flex gap-1 items-center">
                            <FormLabel
                                htmlFor="validation-form-date"
                                className="mb-0"
                            >
                                <Lucide icon="Calendar" />
                            </FormLabel>
                            <Litepicker
                                value={daterange}
                                onChange={(e) => {
                                    setDaterange(e.target.value);
                                }}
                                id="validation-form-date"
                                name="date"
                                options={{
                                    autoApply: false,
                                    singleMode: false,
                                    numberOfColumns: 2,
                                    numberOfMonths: 2,
                                    showWeekNumbers: false,
                                    dropdowns: {
                                        minYear: new Date().getFullYear(),
                                        maxYear: new Date().getFullYear() + 2,
                                        months: true,
                                        years: true,
                                    },
                                    lang: "RU-ru",
                                    showTooltip: true,
                                }}
                                className="block w-full"
                                placeholder="Выберите дату"
                            />
                        </div>
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
                        <PhoneInput
                            international={true}
                            defaultCountry="RU"
                            value={tel}
                            onChange={setTel}
                            limitMaxLength={true}
                            maxLength={16}
                        />
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

export default ReservationForm;
