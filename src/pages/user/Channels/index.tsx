import Button from "@/components/Base/Button";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import { Link } from "react-router-dom";
import { useState } from "react";
import Channel from "./channel";

function Main() {
    const [channelsData, setChannelsData] = useState([
        {
            id: 1,
            title: "Авито",
            data: {
                login: "login",
                password: "111222",
                APIkey: "jhe23234jksdkjands",
            },
        },
        {
            id: 2,
            title: "СуточноРу",
            data: {
                login: "login",
                password: "111222",
                APIkey: "jhe23234jksdkjands",
            },
        },
        {
            id: 3,
            title: "Airbnb",
            data: {
                login: "login",
                password: "111222",
                APIkey: "jhe23234jksdkjands",
            },
        },
        {
            id: 4,
            title: "Яндекс.Квартира",
            data: {
                login: "login",
                password: "111222",
                APIkey: "jhe23234jksdkjands",
            },
        },
    ]);

    return (
        <>
            <div className="flex flex-wrap items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Каналы продаж</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Link to="create">
                        <Button variant="primary" className="mr-2 shadow-md">
                            <Lucide className="mr-3" icon="RefreshCw" />
                            Синхронизировать
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-5 intro-y box p-5">
                {channelsData.map((channel) => (
                    <Channel
                        key={channel.id}
                        title={channel.title}
                        data={channel.data}
                    />
                ))}
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
