import Button from "@/components/Base/Button";
import Icon from "@/components/Custom/Icon";
import { Link, useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen text-center error-page">
                <div className="-intro-x">
                    <Icon icon="CheckCircle" className="size-40 text-success" />
                </div>
                <div className="mt-10 lg:mt-0">
                    <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                        Объект успешно забронирован
                    </div>
                    <Link
                        to={".."}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                    >
                        <Button variant="primary" className="px-4 py-3 mt-10">
                            Вернуться
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Main;
