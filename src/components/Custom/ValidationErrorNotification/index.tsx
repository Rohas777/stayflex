import Lucide from "@/components/Base/Lucide";
import Notification, {
    NotificationElement,
} from "@/components/Base/Notification";
import { useEffect, useRef } from "react";
import Toastify from "toastify-js";

interface ValidationErrorNotificationProps {
    show: boolean;
    message?: string;
    description?: string;
    resetValidationError: () => void;
}

function ValidationErrorNotification({
    message,
    description,
    show,
    resetValidationError,
}: ValidationErrorNotificationProps) {
    const notificationRef = useRef<NotificationElement>();

    useEffect(() => {
        if (!show) return;

        const globalErrorEl = notificationRef.current!.cloneNode(
            true
        ) as HTMLElement;
        globalErrorEl.classList.remove("hidden");
        message &&
            (globalErrorEl.querySelector(".text-content")!.textContent =
                message);
        description &&
            (globalErrorEl.querySelector(".description-content")!.textContent =
                description);
        Toastify({
            node: globalErrorEl,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }).showToast();
        setTimeout(() => {
            resetValidationError();
        }, 3000);
    }, [show]);

    return (
        <>
            {/* BEGIN: Error Notification Content */}
            <Notification
                getRef={(el) => {
                    notificationRef.current = el;
                }}
                className="flex items-center hidden"
            >
                <Lucide icon="XCircle" className="text-danger size-7" />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content">
                        Ошибка валидации
                    </div>
                    <div className="mt-1 text-xs text-slate-500 description-content">
                        Пожалуйста, проверьте корректность введенных данных
                    </div>
                </div>
            </Notification>
            {/* END: Error Notification Content */}
        </>
    );
}

export default ValidationErrorNotification;
