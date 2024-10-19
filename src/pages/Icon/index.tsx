import Lucide from "@/components/Base/Lucide";
import * as lucideIcons from "lucide-react";
import { useEffect, useState } from "react";

type IconType = keyof typeof lucideIcons.icons;

function Main() {
    const [iconsToChoose, setIconsToChoose] = useState<IconType[]>([]);
    const { icons } = lucideIcons;
    useEffect(() => {
        setIconsToChoose(Object.keys(icons) as IconType[]);
    }, []);
    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Иконки</h2>
            </div>
            {/* BEGIN: Icon List */}
            <div className="grid grid-cols-12 px-5 py-8 mt-5 intro-y sm:gap-6 gap-y-6 box">
                {iconsToChoose.map((icon) => (
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1 xl:col-span-1">
                        <Lucide icon={icon} className="block mx-auto" />
                        <div className="mt-2 text-xs text-center">{icon}</div>
                    </div>
                ))}
            </div>
            {/* END: Icon List */}
        </>
    );
}

export default Main;
