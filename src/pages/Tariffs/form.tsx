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
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { TariffCreateType } from "@/stores/reducers/tariffs/types";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchTariffById } from "@/stores/reducers/tariffs/actions";
import * as lucideIcons from "lucide-react";
import TomSelect from "@/components/Base/TomSelect";
import Lucide from "@/components/Base/Lucide";

type IconType = keyof typeof lucideIcons.icons;

interface TariffFormProps {
    isCreate: boolean;
    onCreate: (tariffData: TariffCreateType) => void;
    onUpdate: (tariffData: TariffCreateType) => void;
    currentTariffId: number;
    icons: IconType[];
}

function TariffForm({
    isCreate,
    onCreate,
    onUpdate,
    icons,
    currentTariffId,
}: TariffFormProps) {
    const dropzoneValidationRef = useRef<DropzoneElement>();
    const [uploadedIcon, setUploadedIcon] = useState<File | null>(null);
    const [dropzoneError, setDropzoneError] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string>("-1");

    const { tariffById, status, error } = useAppSelector(
        (state) => state.tariff
    );
    const dispatch = useAppDispatch();

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
        const result = await trigger();
        if ((!uploadedIcon && !result) || !uploadedIcon) {
            dropzoneValidationRef.current?.classList.add(
                "border-danger-important"
            );
            setDropzoneError("Обязательно загрузите иконку");
            return;
        }
        if (!result) {
            return;
        }
        const formData = new FormData(event.target);
        // const tariffData: TariffCreateType = {
        //     tariff_name: JSON.stringify({
        //         name: String(formData.get("name")),
        //     }),
        //     file: uploadedIcon,
        // };

        // if (isCreate) {
        //     onCreate(tariffData);
        // } else {
        //     onUpdate(tariffData);
        // }
    };

    useEffect(() => {
        const elDropzoneValidationRef = dropzoneValidationRef.current;
        if (elDropzoneValidationRef) {
            elDropzoneValidationRef.dropzone.on("success", (file) => {
                setUploadedIcon(file);
                setDropzoneError(null);
                dropzoneValidationRef.current?.classList.remove(
                    "border-danger-important"
                );
            });
            elDropzoneValidationRef.dropzone.on("removedfile", () => {
                setUploadedIcon(null);
            });
            elDropzoneValidationRef.dropzone.on("error", (file) => {
                elDropzoneValidationRef.dropzone.removeFile(file);
            });
        }

        if (!isCreate) {
            dispatch(fetchTariffById(currentTariffId));
        }
    }, []);

    return (
        <>
            {status === Status.LOADING && (
                <div className="fixed inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                    <div className="w-10 h-10">
                        <LoadingIcon icon="ball-triangle" />
                    </div>
                </div>
            )}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    {isCreate ? "Добваить" : "Редактировать"} удобство
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
                        <div className="flex items-center gap-2">
                            {selectedIcon != "-1" && (
                                <Lucide icon={selectedIcon as IconType} />
                            )}
                            <TomSelect
                                id="validation-form-icon"
                                value={selectedIcon}
                                name="icon"
                                onChange={(e) => {
                                    setSelectedIcon(e.target.value);
                                }}
                                options={{
                                    placeholder: "Выберите иконку",
                                }}
                                className="w-full"
                            >
                                {icons.map((icon) => (
                                    <option key={icon} value={icon}>
                                        {icon}
                                    </option>
                                ))}
                            </TomSelect>
                        </div>

                        {errors.name && (
                            <div className="mt-2 text-danger">
                                {typeof errors.name.message === "string" &&
                                    errors.name.message}
                            </div>
                        )}
                        {/* {!isCreate && (
                            <div className="flex justify-end items-center gap-2">
                                <p>Текущая иконка: </p>
                                <img
                                    className="size-12"
                                    src={tariffById?.icon}
                                    alt=""
                                />
                            </div>
                        )} */}
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
