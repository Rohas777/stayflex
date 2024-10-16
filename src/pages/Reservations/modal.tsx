import "@/assets/css/vendors/tabulator.css";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { useAppSelector } from "@/stores/hooks";
import { convertDateString } from "@/utils/customUtils";

interface TariffFormProps {}
function Modal({}: TariffFormProps) {
    const { reservationById, statusByID, error } = useAppSelector(
        (state) => state.reservation
    );

    if (statusByID === Status.LOADING) {
        return (
            <>
                <div className="w-full h-60 relative rounded-md overflow-hidden">
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
                    Информация по брони
                </div>
                <ul className="mt-7">
                    <li>
                        <strong className="inline-block w-20">Объект:</strong>
                        {reservationById && reservationById?.object.name}
                    </li>
                    <li>
                        <strong className="inline-block mt-3 w-20">Имя:</strong>
                        {reservationById && reservationById?.client.fullname}
                    </li>
                    <li>
                        <strong className="inline-block mt-3 w-20">
                            Номер:
                        </strong>
                        {reservationById && reservationById?.client.phone}
                    </li>
                    <li>
                        <strong className="inline-block mt-3 w-20">
                            Email:
                        </strong>
                        {reservationById && reservationById?.client.email}
                    </li>
                    <li>
                        <strong className="inline-block mt-3 mb-10 w-20">
                            Дата:
                        </strong>
                        {reservationById &&
                            convertDateString(reservationById?.start_date!) +
                                " - " +
                                convertDateString(reservationById?.end_date!)}
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Modal;
