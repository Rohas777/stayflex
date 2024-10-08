import { FormSwitch } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type AccordionWithSwitcherProps = {
    children: string | React.ReactNode | JSX.Element | JSX.Element[];
    title: string;
    checked?: boolean;
};

function AccordionWithSwitcher({
    children,
    title,
    checked = false,
}: AccordionWithSwitcherProps) {
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
                    className="p-5 cursor-pointer flex justify-between items-center"
                    onClick={(event) => {
                        onOpen(event);
                    }}
                >
                    <div className="flex items-center text-lg">
                        <div className="mr-5 rounded-full border-black border flex items-center justify-center size-7">
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
                    <div ref={switcherRef}>
                        <FormSwitch
                            onChange={() => {
                                onSwitch();
                            }}
                        >
                            <FormSwitch.Input
                                defaultChecked={checked}
                                id="checkbox-switch-7"
                                type="checkbox"
                            />
                        </FormSwitch>
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

export default AccordionWithSwitcher;
