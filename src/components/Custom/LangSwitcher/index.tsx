import enFlag from "/src/assets/images/flags/eng.svg";
import ruFlag from "/src/assets/images/flags/rus.svg";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import Tippy from "@/components/Base/Tippy";
import { useAppDispatch } from "@/stores/hooks";
import { setLanguage } from "@/stores/languageSlice";
import Notification, {
    NotificationElement,
} from "@/components/Base/Notification";
import Toastify from "toastify-js";
import { useRef, useState } from "react";

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const dispatch = useAppDispatch();
    const [prevLang, setPrevLang] = useState(i18n.language);

    const notificationRef = useRef<NotificationElement>();

    const handleLanguageChange = (lang: string) => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);

        if (prevLang === lang) return;
        const globalErrorEl = notificationRef.current!.cloneNode(
            true
        ) as HTMLElement;
        globalErrorEl.classList.remove("hidden");
        globalErrorEl.querySelector(".text-content")!.textContent = t(
            "theme_switcher.lang.lang_change"
        );
        Toastify({
            node: globalErrorEl,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
        }).showToast();
        setPrevLang(lang);
    };

    return (
        <>
            <div className="px-8 pt-6 pb-8">
                <div className="text-base font-medium">
                    {t("theme_switcher.lang.system_lang")}
                </div>
                <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3.5">
                    <div>
                        <a
                            onClick={() => handleLanguageChange("ru")}
                            className={clsx([
                                "aspect-square overflow-hidden rounded-md cursor-pointer bg-slate-200 box p-1 border-slate-300/80 block",
                                "[&.active]:border-2 [&.active]:border-theme-1/60",
                                i18n.language === "ru" ? "active" : "",
                            ])}
                        >
                            <div className="h-full image-fit">
                                <img src={ruFlag} alt="Ru" />
                            </div>
                        </a>
                        <div className="mt-2.5 text-center text-xs capitalize">
                            {t("theme_switcher.lang.ru")}
                        </div>
                    </div>
                    <div className="relative">
                        <Tippy content={t("theme_switcher.lang.on_dev")}>
                            <a
                                onClick={() => handleLanguageChange("en")}
                                className={clsx([
                                    "aspect-square rounded-md overflow-hidden bg-slate-200 box p-1 border-slate-300/80 block",
                                    "[&.active]:border-2 [&.active]:border-theme-1/60",
                                    i18n.language === "en" ? "active" : "",
                                ])}
                            >
                                <div className="h-full image-fit">
                                    <img src={enFlag} alt="En" />
                                </div>
                            </a>
                            <Icon
                                className="absolute top-0 right-0 -mt-2 -mr-2 text-white bg-pending p-2 rounded-full size-8 stroke-2"
                                icon="Wrench"
                            />
                        </Tippy>
                        <div className="mt-2.5 text-center text-xs capitalize">
                            {t("theme_switcher.lang.en")}
                        </div>
                    </div>
                </div>
            </div>
            {/* BEGIN: Error Notification Content */}
            <Notification
                className="flex items-center hidden"
                getRef={(el) => {
                    notificationRef.current = el;
                }}
            >
                <Icon
                    icon="CheckCircle"
                    className="text-success size-10 xl:size-5"
                />
                <div className="ml-4 mr-4">
                    <div className="font-medium text-content"></div>
                </div>
            </Notification>
            {/* END: Error Notification Content */}
        </>
    );
};

export default LanguageSwitcher;
