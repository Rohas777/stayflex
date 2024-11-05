import React from "react";
import { twMerge } from "tailwind-merge";
import * as lucideIcons from "lucide-react";
import * as lucideLabIcons from "@lucide/lab";
import { createLucideIcon } from "lucide-react";

export const { icons } = lucideIcons;

interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
    icon: keyof typeof icons | keyof typeof lucideLabIcons;
}
const Icon: React.FC<IconProps> = (props) => {
    const { icon, ...computedProps } = props;

    if (icon in lucideLabIcons) {
        //@ts-ignore
        const IconLucide = createLucideIcon(icon, lucideLabIcons[icon]);
        return (
            <IconLucide
                {...computedProps}
                className={twMerge(["stroke-1.5 size-5", props.className])}
            />
        );
    }
    if (icon in icons) {
        //@ts-ignore
        const IconComponent = icons[icon];
        return (
            <IconComponent
                {...computedProps}
                className={twMerge(["stroke-1.5 size-5", props.className])}
            />
        );
    }
    return;
};

export default Icon;
