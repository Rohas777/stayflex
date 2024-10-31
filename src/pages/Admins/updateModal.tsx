import "@/assets/css/vendors/tabulator.css";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import {
    UserTariffUpdateType,
    UserUpdateType,
} from "@/stores/reducers/users/types";
import { useAppSelector } from "@/stores/hooks";
import { Status } from "@/stores/reducers/types";
import Loader from "@/components/Custom/Loader/Loader";
import UserUpdateForm from "./updateUserForm";

interface UserUpdateModalProps {
    onUpdateUser: (userData: UserUpdateType) => void;
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isLoaderOpen: boolean;
}

function UserUpdateModal({
    onUpdateUser,
    setIsLoaderOpen,
    isLoaderOpen,
}: UserUpdateModalProps) {
    const { statusOne } = useAppSelector((state) => state.user);
    const tariffState = useAppSelector((state) => state.tariff);

    if (
        (statusOne === Status.LOADING ||
            tariffState.statusAll === Status.LOADING) &&
        !isLoaderOpen
    )
        return <Loader />;

    return (
        <>
            {isLoaderOpen && <OverlayLoader />}
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Редактировать администратора
                </div>

                <UserUpdateForm
                    onUpdate={onUpdateUser}
                    setIsLoaderOpen={setIsLoaderOpen}
                    isLoaderOpen={isLoaderOpen}
                />
            </div>
        </>
    );
}

export default UserUpdateModal;
