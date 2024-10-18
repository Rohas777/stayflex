import LoadingIcon from "@/components/Base/LoadingIcon";

function Loader() {
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

export default Loader;
