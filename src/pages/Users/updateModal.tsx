import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Toastify from "toastify-js";
import { FormLabel, FormInput } from "@/components/Base/Form";
import { useEffect, useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { startLoader, stopLoader } from "@/utils/customUtils";
import { UserCreateType, UserUpdateType } from "@/stores/reducers/users/types";
import PhoneInput from "react-phone-input-2";
import ru from "react-phone-input-2/lang/ru.json";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import { Tab } from "@/components/Base/Headless";
import UserUpdateForm from "./updateUserForm";

interface UserUpdateModalProps {
    onUpdate: (userData: UserUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}

function UserUpdateModal({
    onUpdate,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserUpdateModalProps) {
    const { statusOne } = useAppSelector((state) => state.user);

    if (statusOne === Status.LOADING && !isLoaderOpen) return <Loader />;

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Редактировать пользователя
                </div>
                <Tab.Group className="mt-5">
                    <Tab.List variant="link-tabs">
                        <Tab>
                            <Tab.Button className="w-full py-2" as="button">
                                Данные
                            </Tab.Button>
                        </Tab>
                        <Tab>
                            <Tab.Button className="w-full py-2" as="button">
                                Тариф
                            </Tab.Button>
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className="mt-5">
                        <Tab.Panel className="leading-relaxed">
                            <UserUpdateForm
                                onUpdate={onUpdate}
                                setIsLoaderOpen={setIsLoaderOpen}
                                isLoaderOpen={isLoaderOpen}
                            />
                        </Tab.Panel>
                        <Tab.Panel className="leading-relaxed">
                            <UserUpdateForm
                                onUpdate={onUpdate}
                                setIsLoaderOpen={setIsLoaderOpen}
                                isLoaderOpen={isLoaderOpen}
                            />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
}

export default UserUpdateModal;
