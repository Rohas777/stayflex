import Lucide from "@/components/Base/Lucide";
import Notification from "@/components/Base/Notification";
import { errorToastSlice } from "@/stores/errorToastSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useEffect } from "react";
import Toastify from "toastify-js";

function ErrorNotification() {
    const dispatch = useAppDispatch();
    const { message, isError } = useAppSelector((state) => state.error);
    const { setErrorToast } = errorToastSlice.actions;

    useEffect(() => {
        if (isError && !!message) {
            const globalErrorEl = document
                .querySelectorAll("#global-error-notification")[0]
                .cloneNode(true) as HTMLElement;
            globalErrorEl.classList.remove("hidden");
            globalErrorEl.querySelector(".text-content")!.textContent = message;
            Toastify({
                node: globalErrorEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
            dispatch(setErrorToast({ isError: false, message: null }));
        }
    }, [isError]);

    return (
        <>
            {/* BEGIN: Error Notification Content */}
            <Notification
                id="global-error-notification"
                className="flex hidden"
            >
                <Lucide icon="XCircle" className="text-danger" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content"></div>
                </div>
            </Notification>
            {/* END: Error Notification Content */}
        </>
    );
}

export default ErrorNotification;
