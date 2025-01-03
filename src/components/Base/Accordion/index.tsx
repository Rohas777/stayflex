import { FormSwitch } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type AccordionProps = {
    children: string | React.ReactNode | JSX.Element | JSX.Element[];
    title: string;
};

function Accordion({ children, title }: AccordionProps) {
    const switcherRef = useRef<HTMLDivElement | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const onSwitch = () => {};
    const onOpen = (event: any) => {
        if (switcherRef.current && switcherRef.current.contains(event.target))
            return;
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            <div className="border border-gray-200">
                <div
                    className="py-5 px-2 sm:px-5 cursor-pointer flex justify-between items-center"
                    onClick={(event) => {
                        onOpen(event);
                    }}
                >
                    <div className="flex items-center text-base sm:text-lg">
                        <div className="mr-3 sm:mr-5 rounded-full border-black border flex items-center justify-center size-6 sm:size-7">
                            <Lucide
                                icon="ChevronUp"
                                className={twMerge(
                                    "transition-transform",
                                    isCollapsed ? "rotate-180" : ""
                                )}
                            />
                        </div>
                        {title}
                    </div>
                </div>
                {isCollapsed && (
                    <div className="p-6 border-t leading-relaxed text-slate-600 dark:text-slate-500">
                        {children}
                    </div>
                )}
            </div>
        </>
    );
}

export default Accordion;
