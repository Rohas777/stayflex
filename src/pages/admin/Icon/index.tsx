import * as lucideIcons from "lucide-react";
import * as lucideLabIcons from "@lucide/lab";
import { useEffect, useState } from "react";
import Icon from "@/components/Custom/Icon";
import { IconType } from "@/vars";

function Main() {
    const [iconsToChoose, setIconsToChoose] = useState<IconType[]>([]);

    useEffect(() => {
        const icons = Object.keys(lucideIcons.icons) as IconType[];
        const labIcons = Object.keys(lucideLabIcons) as IconType[];
        setIconsToChoose([...icons, ...labIcons]);
    }, []);

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Иконки</h2>
            </div>
            {/* BEGIN: Icon List */}
            <div className="grid grid-cols-12 px-5 py-8 mt-5 intro-y sm:gap-6 gap-y-6 box">
                {iconsToChoose.map((icon) => (
                    <div
                        key={"Phosphor-" + icon}
                        className="col-span-4 sm:col-span-2 lg:col-span-1 xl:col-span-1"
                    >
                        <Icon icon={icon} className="block mx-auto" />
                        <div className="mt-2 text-xs text-center">{icon}</div>
                    </div>
                ))}
            </div>
            {/* END: Icon List */}
        </>
    );
}

export default Main;
