import Button from "@/components/Base/Button";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import { Link } from "react-router-dom";
import Server from "./server";
import { useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import { ListPlus } from "lucide-react";

function Main() {
    const [select, setSelect] = useState("1");
    const [serversData, setServersData] = useState([
        {
            id: 1,
            name: "Stayflex",
            ip: "192.128.1.1",
            login: "login",
            password: "111222",
        },
    ]);

    return (
        <>
            <div className="flex flex-wrap items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Серверы</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Link to="create">
                        <Button variant="primary" className="mr-2 shadow-md">
                            <ListPlus className="size-5 mr-2" />
                            Добавить
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-5 intro-y box p-5">
                {serversData.map((server) => (
                    <Server data={server} />
                ))}
            </div>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Сервер по умолчанию
                </h2>
            </div>
            <div className="mt-5 intro-y box p-5">
                {/* BEGIN: Basic Select */}
                <div className="grid grid-cols-12 gap-3 sm:gap-5">
                    <div className="col-span-12 sm:col-span-7">
                        <TomSelect
                            value={select}
                            onChange={(e) => {
                                setSelect(e.target.value);
                            }}
                            options={{
                                controlInput: undefined,
                                searchField: undefined,
                            }}
                            className="w-full"
                        >
                            {serversData.map((server) => (
                                <option value={server.id}>{server.name}</option>
                            ))}
                        </TomSelect>
                    </div>
                    <Button
                        variant="primary"
                        className="col-span-12 sm:col-span-5 flex items-center justify-center shadow-md"
                    >
                        <Lucide
                            icon="Save"
                            className="size-5 mr-2 flex-shrink-0"
                        />
                        Сохранить
                    </Button>
                </div>
                {/* END: Basic Select */}
            </div>
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Saving success!</div>
                    <div className="mt-1 text-slate-500">
                        Please check your e-mail for further info!
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
            {/* BEGIN: Failed Notification Content */}
            <Notification
                id="failed-notification-content"
                className="flex hidden"
            >
                <Lucide icon="XCircle" className="text-danger" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Saving failed!</div>
                    <div className="mt-1 text-slate-500">
                        Please check the fileld form.
                    </div>
                </div>
            </Notification>
            {/* END: Failed Notification Content */}
        </>
    );
}

export default Main;
