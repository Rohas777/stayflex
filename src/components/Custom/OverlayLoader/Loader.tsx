import LoadingIcon from "@/components/Base/LoadingIcon";
import clsx from "clsx";

function OverlayLoader({ className }: { className?: string }) {
    return (
        <>
            <div
                className={clsx(
                    "fixed inset-0 z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full",
                    className
                )}
            >
                <div className="w-10 h-10">
                    <LoadingIcon icon="ball-triangle" />
                </div>
            </div>
        </>
    );
}

export default OverlayLoader;
