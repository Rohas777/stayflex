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
import { CityCreateType } from "@/stores/reducers/cities/types";
import { IRegion } from "@/stores/models/IRegion";

interface CityFormProps {
    isCreate: boolean;
    onCreate: (data: CityCreateType) => void;
    onUpdate: (data: CityCreateType) => void;
    regions: IRegion[];
    cityData?: {
        name: string;
        regionID: number;
        server: number;
    };
}

function CityForm({
    isCreate,
    onCreate,
    onUpdate,
    cityData,
    regions,
}: CityFormProps) {
    const [selectServer, setSelectServer] = useState(
        !isCreate ? String(cityData?.server) : "1"
    );
    const [selectRegion, setSelectRegion] = useState(
        !isCreate ? String(cityData?.regionID) : "empty"
    );
    const [serversData, setServersData] = useState([
        {
            id: 1,
            name: "Server-1",
        },
        {
            id: 2,
            name: "Server-2",
        },
        {
            id: 3,
            name: "Server-3",
        },
        {
            id: 4,
            name: "Server-4",
        },
    ]);
    const schema = yup
        .object({
            name: yup.string().required("'Название' это обязательное поле"),
            region: yup.string().required("'Регион' это обязательное поле"),
            // .mixed()
            // .oneOf(
            //     regions.map((region) => region.id),
            //     "Выбрано недопустимое значение"
            // )
            // .required(),
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
        console.log(result);
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
            const city: CityCreateType = {
                name: String(formData.get("name")),
                regionID: 1,
            };
            if (isCreate) {
                onCreate(city);
            } else {
                onUpdate(city);
            }
        }
    };

    return (
        <>
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добваить регион
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
                                !isCreate ? cityData?.name : undefined
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
                    <div className="mt-3">
                        <FormLabel
                            htmlFor="validation-form-region"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Регион
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <TomSelect
                            {...register("region")}
                            id="validation-form-region"
                            value={selectRegion}
                            name="region"
                            onChange={(e) => {
                                setSelectRegion(e.target.value);
                                trigger("region");
                            }}
                            options={{
                                controlInput: undefined,
                                searchField: undefined,
                            }}
                            className={clsx({
                                "w-full border-danger": errors.region,
                            })}
                        >
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </TomSelect>
                        {errors.region && (
                            <div className="mt-2 text-danger">
                                {typeof errors.region.message === "string" &&
                                    errors.region.message}
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
                        <TomSelect
                            id="validation-form-server"
                            value={selectServer}
                            name="server"
                            onChange={(e) => {
                                setSelectServer(e.target.value);
                            }}
                            options={{
                                controlInput: undefined,
                                searchField: undefined,
                            }}
                            className="w-full"
                        >
                            {serversData.map((server) => (
                                <option key={server.id} value={server.id}>
                                    {server.name}
                                </option>
                            ))}
                        </TomSelect>
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

export default CityForm;
