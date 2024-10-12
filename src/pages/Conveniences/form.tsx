import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { ConvenienceCreateType } from "@/stores/reducers/conveniences/types";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";

interface ConvenienceFormProps {
    isCreate: boolean;
    onCreate: (convenienceData: ConvenienceCreateType) => void;
    onUpdate: (convenienceData: ConvenienceCreateType) => void;
    currentConvenience: {
        name: string;
        icon: string;
    };
    status: Status;
}

function ConvenienceForm({
    isCreate,
    onCreate,
    onUpdate,
    currentConvenience,
    status,
}: ConvenienceFormProps) {
    const dropzoneValidationRef = useRef<DropzoneElement>();
    const [uploadedIcon, setUploadedIcon] = useState<File | null>(null);
    const [dropzoneError, setDropzoneError] = useState<string | null>(null);

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
        const convenienceData: ConvenienceCreateType = {
            convenience_name: JSON.stringify({
                name: String(formData.get("name")),
            }),
            file: uploadedIcon,
        };

        if (isCreate) {
            onCreate(convenienceData);
        } else {
            onUpdate(convenienceData);
        }
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
                                !isCreate ? currentConvenience?.name : undefined
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
                            htmlFor="validation-form-name"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Иконка
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        {!isCreate && (
                            <div className="flex justify-end items-center gap-2">
                                <p>Текущая иконка: </p>
                                <img
                                    className="size-12"
                                    src={currentConvenience?.icon}
                                    alt=""
                                />
                            </div>
                        )}
                        <Dropzone
                            getRef={(el) => {
                                dropzoneValidationRef.current = el;
                            }}
                            options={{
                                url: "https://httpbin.org/post",
                                thumbnailWidth: 120,
                                maxFilesize: 10,
                                maxFiles: 1,
                                resizeHeight: 40,
                                resizeWidth: 40,
                                acceptedFiles: "image/*",
                                clickable: true,
                                addRemoveLinks: true,
                            }}
                            className="dropzone"
                        >
                            <p className="text-lg font-medium">
                                Перетащите файл сюда или кликните для выбора.
                            </p>
                            {!isCreate && (
                                <p className="text-gray-600 text-base">
                                    При добавлении нового файла текущая иконка{" "}
                                    <span className="font-bold text-danger">
                                        заменится
                                    </span>
                                    .
                                </p>
                            )}
                        </Dropzone>
                        {dropzoneError && (
                            <div className="mt-2 text-danger">
                                {typeof dropzoneError === "string" &&
                                    dropzoneError}
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

export default ConvenienceForm;
