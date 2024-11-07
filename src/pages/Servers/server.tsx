import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import Accordion from "@/components/Base/Accordion";
import { useAppSelector } from "@/stores/hooks";
import { useEffect, useState } from "react";
import { IServer } from "@/stores/models/IServer";
import Icon from "@/components/Custom/Icon";
import { ServerUpdateType } from "@/stores/reducers/servers/types";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

interface IConfiramtionModal {
    title: string | null;
    description: string | null;
    onConfirm: (() => void) | null;
    confirmLabel: string | null;
    cancelLabel: string | null;
    is_danger: boolean;
}

interface ServerProps {
    onUpdate: (server: ServerUpdateType) => void;
    onDelete: (id: number) => void;
    id: number;
    isLoaderOpened: boolean;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmationModalContent: React.Dispatch<
        React.SetStateAction<IConfiramtionModal>
    >;
    setConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function Server({
    id,
    onUpdate,
    onDelete,
    isLoaderOpened,
    setIsLoaderOpened,
    setConfirmationModalContent,
    setConfirmationModal,
}: ServerProps) {
    const { servers } = useAppSelector((state) => state.server);

    const [data, setData] = useState<IServer | null>(null);

    const schema = yup
        .object({
            name: yup.string().required("'Название' это обязательное поле"),
            container_name: yup
                .string()
                .required("'Имя контейнера' это обязательное поле"),
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
        const server: ServerUpdateType = {
            id: data!.id!,
            name: String(formData.get("name")),
            container_name: String(formData.get("container_name")),
        };
        stopLoader(setIsLoaderOpened);

        setConfirmationModalContent({
            title: "Изменить сервер?",
            description:
                "Вы уверены что хотите изменить данные сервера " +
                data?.name +
                "?",
            onConfirm: () => {
                startLoader(setIsLoaderOpened);
                onUpdate(server);
            },
            confirmLabel: "Обновить",
            cancelLabel: "Отмена",
            is_danger: false,
        });
        setConfirmationModal(true);
    };
    const onClickDelete = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.preventDefault();

        setConfirmationModalContent({
            title: "Удалить сервер?",
            description:
                "Вы уверены что хотите удалить сервер " + data?.name + "?",
            onConfirm: () => {
                startLoader(setIsLoaderOpened);
                onDelete(data!.id!);
            },
            confirmLabel: "Удалить",
            cancelLabel: "Отмена",
            is_danger: true,
        });
        setConfirmationModal(true);
    };

    useEffect(() => {
        setData(servers.find((item) => item.id === id)!);
    }, [servers]);

    return (
        <>
            <Accordion title={data?.name ?? ""}>
                <form className="validate-form" onSubmit={onSubmit}>
                    <div className="grid grid-cols-12 gap-3 sm:gap-10">
                        <div className="input-form col-span-12 sm:col-span-6">
                            <FormLabel
                                htmlFor="validation-form-1"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Название
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("name")}
                                id="validation-form-1"
                                type="text"
                                name="name"
                                defaultValue={data?.name ?? undefined}
                                className={clsx({
                                    "border-danger": errors.name,
                                })}
                                placeholder="Name"
                            />
                            {errors.name && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.name.message === "string" &&
                                        errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="input-form col-span-12 sm:col-span-6">
                            <FormLabel
                                htmlFor="validation-form-2"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Имя контейнера
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Обязательное
                                </span>
                            </FormLabel>
                            <FormInput
                                {...register("container_name")}
                                id="validation-form-2"
                                type="text"
                                name="container_name"
                                defaultValue={data?.container_name ?? undefined}
                                className={clsx({
                                    "border-danger": errors.container_name,
                                })}
                                placeholder="stayflex.container"
                            />
                            {errors.container_name && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.container_name.message ===
                                        "string" &&
                                        errors.container_name.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end flex-wrap gap-4 mt-5">
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex items-center"
                        >
                            <Icon icon="ArrowBigUpDash" className="mr-2" />
                            Обновить
                        </Button>
                        <Button
                            variant="danger"
                            className="flex items-center"
                            onClick={onClickDelete}
                        >
                            <Icon icon="Trash2" className="mr-2" />
                            Удалить
                        </Button>
                    </div>
                </form>
            </Accordion>
        </>
    );
}

export default Server;
