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
import { useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";
import Icon from "@/components/Custom/Icon";
import Tippy from "@/components/Base/Tippy";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";

interface UserBalanceEditFormProps {
    onEdit: (userData: UserUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}

function UserBalanceEditForm({
    onEdit,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserBalanceEditFormProps) {
    const tariffState = useAppSelector((state) => state.tariff);
    const { userOne, statusOne } = useAppSelector((state) => state.user);

    const [selectedTariff, setSelectedTariff] = useState<string>("-1");

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

        const userData: UserUpdateType = {
            id: userOne!.id,
            fullname: userOne!.fullname,
            phone: userOne!.phone,
            mail: userOne!.mail,
            balance: Number(formData.get("balance")),
        };
        onEdit(userData);
    };

    useEffect(() => {
        if (statusOne !== Status.SUCCESS || !userOne || !userOne.tariff) return;
        setSelectedTariff(String(userOne.tariff.id));
    }, [statusOne, userOne]);

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Редактировать баланс
                </div>
                <form className="validate-form mt-5" onSubmit={onSubmit}>
                    <div className="input-form mt-3">
                        <FormLabel
                            htmlFor="validation-form-balance"
                            className="flex flex-col w-full sm:flex-row"
                        >
                            Редактировать баланс
                            <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                Обязательное
                            </span>
                        </FormLabel>
                        <p className="text-xs mt-1 mb-3">
                            Баланс пользователя: {userOne?.balance}
                        </p>
                        <FormInput
                            {...register("balance")}
                            id="validation-form-balance"
                            aria-describedby="input-group-balance"
                            type="number"
                            name="balance"
                            className={clsx({
                                "border-danger": errors.balance,
                            })}
                            defaultValue={userOne?.balance ?? 0}
                            placeholder="1 000"
                        />
                        {errors.balance && (
                            <div className="mt-2 text-danger">
                                {typeof errors.balance.message === "string" &&
                                    errors.balance.message}
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-5"
                    >
                        Обновить
                    </Button>
                </form>
            </div>
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default UserBalanceEditForm;
