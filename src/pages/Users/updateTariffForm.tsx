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
import { UserTariffUpdateType } from "@/stores/reducers/users/types";
import { useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";

interface UserTariffUpdateFormProps {
    onUpdate: (userData: UserTariffUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}
type CustomErrors = {
    isValid: boolean;
    tariff: string | null;
};

function UserTariffUpdateForm({
    onUpdate,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserTariffUpdateFormProps) {
    const tariffState = useAppSelector((state) => state.tariff);
    const { userOne, statusOne } = useAppSelector((state) => state.user);

    const [selectedTariff, setSelectedTariff] = useState<string>("-1");

    const [showValidationNotification, setShowValidationNotification] =
        useState(false);
    const [customErrors, setCustomErrors] = useState<CustomErrors>({
        isValid: true,
        tariff: null,
    });

    const vaildateWithoutYup = async () => {
        const errors: CustomErrors = {
            isValid: true,
            tariff: null,
        };

        if (selectedTariff === "-1") {
            errors.tariff = "Выберите тариф";
        }

        Object.keys(errors).forEach((key) => {
            if (errors[key as keyof CustomErrors] && key != "isValid") {
                errors.isValid = false;
                return;
            }
        });
        setCustomErrors(errors);
        return errors;
    };

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
        const customResult = await vaildateWithoutYup();
        if (!result || !customResult.isValid) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpen);
            return;
        }

        const userData: UserTariffUpdateType = {
            tariff_id: Number(selectedTariff),
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
                <FormLabel
                    htmlFor="validation-form-name"
                    className="flex flex-col w-full sm:flex-row"
                >
                    Тариф
                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                        Обязательное
                    </span>
                </FormLabel>
                <div
                    className={clsx(
                        "mt-3 border rounded-md border-transparent",
                        {
                            "border-danger-important": customErrors.tariff,
                        }
                    )}
                >
                    <TomSelect
                        value={selectedTariff}
                        onChange={(e) => {
                            setSelectedTariff(e.target.value);

                            setCustomErrors((prev) => ({
                                ...prev,
                                tariff: null,
                            }));
                        }}
                        options={{
                            placeholder: "Выберите тариф",
                        }}
                        className="w-full"
                    >
                        {tariffState.tariffs.map((tariff) => (
                            <option key={tariff.id} value={tariff.id}>
                                {tariff.name}
                            </option>
                        ))}
                    </TomSelect>
                </div>
                {customErrors.tariff && (
                    <div className="mt-2 text-danger">
                        {typeof customErrors.tariff === "string" &&
                            customErrors.tariff}
                    </div>
                )}
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
                    <p className="mt-1 mb-3 text-xs ">
                        Баланс пользователя: {userOne?.balance}
                    </p>
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
                    Обновить
                </Button>
            </form>
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default UserTariffUpdateForm;
