import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useState } from "react";
import TomSelect from "@/components/Base/TomSelect";
import { CityCreateType } from "@/stores/reducers/cities/types";
import { IRegion } from "@/stores/models/IRegion";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchRegions } from "@/stores/reducers/regions/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";

interface CityFormProps {
    onCreate: (data: CityCreateType) => void;
}

function CityForm({ onCreate }: CityFormProps) {
    const [selectServer, setSelectServer] = useState("1");
    const [selectRegion, setSelectRegion] = useState("-1");
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

    const { regions, status, error } = useAppSelector((state) => state.region);
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
            const city: CityCreateType = {
                name: String(formData.get("name")),
                region_id: Number(selectRegion),
            };
            onCreate(city);
        }
    };

    useEffect(() => {
        dispatch(fetchRegions());
    }, []);

    if (status === Status.LOADING) {
        return (
            <>
                <div className="w-full h-60 relative rounded-sm">
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
                    Добавить город
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
                            htmlFor="validation-form-region"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Регион
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <TomSelect
                            id="validation-form-region"
                            value={selectRegion}
                            name="region"
                            onChange={(e) => {
                                setSelectRegion(e.target.value);
                            }}
                            options={{
                                placeholder: "Выберите регион",
                            }}
                            className="w-full"
                        >
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </TomSelect>
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
                        Добавить
                    </Button>
                </form>
            </div>
        </>
    );
}

export default CityForm;
