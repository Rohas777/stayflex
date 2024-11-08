import enFlag from "/src/assets/images/flags/eng.svg";
import ruFlag from "/src/assets/images/flags/rus.svg";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Icon from "../Icon";
import Tippy from "@/components/Base/Tippy";
import { useAppDispatch } from "@/stores/hooks";
import { setLanguage } from "@/stores/languageSlice";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const dispatch = useAppDispatch();

    const handleLanguageChange = (lang: string) => {
        dispatch(setLanguage(lang));
        i18n.changeLanguage(lang);
    };

    return (
        <div className="px-8 pt-6 pb-8">
            <div className="text-base font-medium">Язык системы</div>
            <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3.5">
                <div>
                    <a
                        onClick={() => handleLanguageChange("ru")}
                        className={clsx([
                            "aspect-square overflow-hidden rounded-md cursor-pointer bg-slate-200 box p-1 border-slate-300/80 block",
                            "[&.active]:border-2 [&.active]:border-theme-1/60",
                        ])}
                    >
                        <div className="h-full image-fit">
                            <img src={ruFlag} alt="Ru" />
                        </div>
                    </a>
                    <div className="mt-2.5 text-center text-xs capitalize">
                        Русский
                    </div>
                </div>
                <div>
                    <Tippy content="В разработке">
                        <a
                            onClick={() => handleLanguageChange("en")}
                            className={clsx([
                                "aspect-square rounded-md overflow-hidden cursor-not-allowed bg-slate-200 box p-1 border-slate-300/80 block",
                                "[&.active]:border-2 [&.active]:border-theme-1/60",
                            ])}
                        >
                            <div className="h-full image-fit">
                                <img src={enFlag} alt="En" />
                            </div>
                            <div className="absolute inset-0 size-full bg-slate-200 bg-opacity-70"></div>
                            <Icon
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 stroke-2"
                                icon="Wrench"
                            />
                        </a>
                    </Tippy>
                    <div className="mt-2.5 text-center text-xs capitalize">
                        Английский
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
