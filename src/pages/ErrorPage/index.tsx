import ThemeSwitcher from "@/components/ThemeSwitcher";
import errorIllustration from "@/assets/images/error-illustration.svg";
import Button from "@/components/Base/Button";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/stores/hooks";

function Main() {
    const { authorizedUser } = useAppSelector((state) => state.user);

    return (
        <>
            <div className="py-2 bg-gradient-to-b from-theme-1 to-theme-2 dark:from-darkmode-800 dark:to-darkmode-800">
                <ThemeSwitcher />
                <div className="container">
                    {/* BEGIN: Error Page */}
                    <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
                        <div className="-intro-x lg:mr-20">
                            <img
                                alt="Midone Tailwind HTML Admin Template"
                                className="w-[450px] h-48 lg:h-auto"
                                src={errorIllustration}
                            />
                        </div>
                        <div className="mt-10 text-white lg:mt-0">
                            <div className="font-medium intro-x text-8xl">
                                404
                            </div>
                            <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                                Упс. Такой стрницы не существует.
                            </div>
                            <div className="mt-3 text-lg intro-x">
                                Возможно, вы ошиблись в адреса или страница
                                переместилась.
                            </div>
                            <Link
                                to={authorizedUser?.is_admin ? "/admin" : "/"}
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
