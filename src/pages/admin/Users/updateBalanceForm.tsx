import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, InputGroup } from "@/components/Base/Form";
import { useEffect, useState } from "react";
import TomSelect from "@/components/Base/TomSelect";
import { startLoader, stopLoader } from "@/utils/customUtils";
import {
    UserTariffUpdateType,
    UserUpdateType,
} from "@/stores/reducers/users/types";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import Icon from "@/components/Custom/Icon";
import Tippy from "@/components/Base/Tippy";
import { Dialog } from "@/components/Base/Headless";
import UserBalanceEditForm from "./editBalanceForm";

interface UserBalanceUpdateFormProps {
    onUpdate: (userData: UserTariffUpdateType) => void;
    onEdit: (userData: UserUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}

function UserBalanceUpdateForm({
    onUpdate,
    onEdit,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserBalanceUpdateFormProps) {
    const tariffState = useAppSelector((state) => state.tariff);
    const { userOne, statusOne } = useAppSelector((state) => state.user);

    const [selectedTariff, setSelectedTariff] = useState<string>("-1");
    const [editBalanceModal, setEditBalanceModal] = useState(false);

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);

    const schema = yup
        .object({
            balance: yup
                .number()
                .lessThan(2147483647, "Превышено максимальное число")
                .typeError("Баланс должен быть числовым значением")
                .positive("Баланс не может быть отрицательным")
                .integer("Баланс должен быть целым числом")
                .moreThan(-1, "Минимальный баланс: 0")
                .required("'Баланс' это обязательное поле"),
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
        const result = await trigger();
        if (!result) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpen);
            return;
        }

        const userData: UserTariffUpdateType = {
            tariff_id: userOne!.tariff.id,
            balance: Number(formData.get("balance")),
            user_id: userOne!.id,
        };
        onUpdate(userData);
    };

    useEffect(() => {
        if (statusOne !== Status.SUCCESS || !userOne || !userOne.tariff) return;
        setSelectedTariff(String(userOne.tariff.id));
    }, [statusOne, userOne]);

    return (
        <>
            <form className="validate-form mt-5" onSubmit={onSubmit}>
                <div className="input-form mt-3">
                    <FormLabel
                        htmlFor="validation-form-balance"
                        className="flex flex-col w-full sm:flex-row"
                    >
                        Пополнить баланс
                        <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Обязательное
                        </span>
                    </FormLabel>
                    <div className="flex items-center justify-between mt-1 mb-3">
                        <p className="text-xs">
                            Баланс пользователя: {userOne?.balance}
                        </p>
                        <Tippy
                            content="Изменить баланс"
                            options={{ placement: "bottom" }}
                        >
                            <Button
                                variant="secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditBalanceModal(true);
                                }}
                            >
                                <Icon icon="Pencil" className="w-4 h-4" />
                            </Button>
                        </Tippy>
                    </div>
                    <InputGroup className="w-full">
                        <InputGroup.Text
                            id="input-group-balance"
                            className={clsx({
                                "border-danger": errors.balance,
                            })}
                        >
                            +
                        </InputGroup.Text>
                        <FormInput
                            {...register("balance")}
                            id="validation-form-balance"
                            aria-describedby="input-group-balance"
                            type="number"
                            name="balance"
                            className={clsx({
                                "border-danger": errors.balance,
                            })}
                            placeholder="1 000"
                        />
                    </InputGroup>
                    {errors.balance && (
                        <div className="mt-2 text-danger">
                            {typeof errors.balance.message === "string" &&
                                errors.balance.message}
                        </div>
                    )}
                </div>
                <Button type="submit" variant="primary" className="w-full mt-5">
                    Пополнить
                </Button>
            </form>
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />

            {/* BEGIN: Modal Content */}
            <Dialog
                open={editBalanceModal}
                onClose={() => {
                    setEditBalanceModal(false);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setEditBalanceModal(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Icon icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <UserBalanceEditForm
                        isLoaderOpen={isLoaderOpen}
                        setIsLoaderOpen={setIsLoaderOpen}
                        onEdit={onEdit}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
        </>
    );
}

export default UserBalanceUpdateForm;
