import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLabel, FormInput, InputGroup } from "@/components/Base/Form";
import { useEffect, useRef, useState } from "react";
import Dropzone, { DropzoneElement } from "@/components/Base/Dropzone";
import { HashtagCreateType } from "@/stores/reducers/hashtags/types";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import * as lucideIcons from "lucide-react";
import * as lucideLabIcons from "@lucide/lab";
import { IconType } from "@/vars";
import Lucide from "@/components/Base/Lucide";
import Icon from "@/components/Custom/Icon";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";

interface HashtagFormProps {
    onCreate: (hashtagData: HashtagCreateType) => void;
    setIsLoaderOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpened: boolean;
}
function HashtagForm({
    onCreate,
    setIsLoaderOpened,
    isLoaderOpened,
}: HashtagFormProps) {
    const [showValidationNotification, setShowValidationNotification] =
        useState(false);

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
        startLoader(setIsLoaderOpened);
        const formData = new FormData(event.target);
        const result = await trigger();
        if (!result) {
            setShowValidationNotification(true);
            stopLoader(setIsLoaderOpened);
            return;
        }
        const hashtagData: HashtagCreateType = {
            name: "#" + String(formData.get("name")),
        };

        onCreate(hashtagData);
    };

    return (
        <>
            {isLoaderOpened && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Добавить хэштег
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
                        <InputGroup className="w-full">
                            <InputGroup.Text
                                id="input-group-name"
                                className={clsx({
                                    "border-danger": errors.name,
                                })}
                            >
                                #
                            </InputGroup.Text>
                            <FormInput
                                {...register("name")}
                                id="validation-form-name"
                                aria-describedby="input-group-name"
                                type="text"
                                name="name"
                                className={clsx({
                                    "border-danger": errors.name,
                                })}
                                placeholder="вид-на-море"
                            />
                        </InputGroup>
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
            <ValidationErrorNotification
                show={showValidationNotification}
                resetValidationError={() => {
                    setShowValidationNotification(false);
                }}
            />
        </>
    );
}

export default HashtagForm;
