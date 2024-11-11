import ThemeSwitcher from "@/components/ThemeSwitcher";
import errorIllustration from "@/assets/images/error-illustration.svg";
import Button from "@/components/Base/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/stores/hooks";
import Icon from "@/components/Custom/Icon";

function Main() {
    const navigate = useNavigate();

    return (
        <>
            <div className="py-2 bg-primary/20">
                <ThemeSwitcher />
                <div className="container">
                    {/* BEGIN: Error Page */}
                    <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
                        <div className="-intro-x lg:mr-20">
                            <Icon
                                icon="CheckCircle"
                                className="size-40 text-success"
                            />
                        </div>
                        <div className="mt-10 text-white lg:mt-0">
                            <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                                Объект успешно забронирован
                            </div>
                            <div className="mt-3 text-lg intro-x">
                                Возможно, вы ошиблись в адресе или страница
                                переместилась
                            </div>
                            <Link
                                to={".."}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(-1);
                                }}
                            >
                                <Button className="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200">
                                    Вернуться
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* END: Error Page */}
                </div>
            </div>
        </>
    );
}

export default Main;
