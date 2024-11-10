import Button from "@/components/Base/Button";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import { Link } from "react-router-dom";
import { useState } from "react";
import TomSelect from "@/components/Base/CustomTomSelect";
import { ListPlus } from "lucide-react";

function Main() {
    const [select, setSelect] = useState("1");
    const [widgetData, setWidgetData] = useState([
        {
            id: 1,
            name: "Объект 1",
        },
        {
            id: 2,
            name: "Объект 2",
        },
        {
            id: 3,
            name: "Объект 3",
        },
        {
            id: 4,
            name: "Объект 4",
        },
    ]);

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Код виджета для сайта
                </h2>
            </div>
            <div className="mt-5 intro-y box p-5">
                <div className="rounded border border-gray-300 p-5">
                    <p>{`The code must be placed before the closing </body> tag `}</p>
                    <p className="mt-4">{`<script> console.log('widget connecting'); </script>`}</p>
                </div>
                <div className="mt-6 rounded border border-gray-300 p-5">
                    <p>{`The code must be placed before the closing </body> tag `}</p>
                    <p className="mt-4">{`<script> console.log('widget connecting'); </script>`}</p>
                </div>
            </div>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Код страницы объекта
                </h2>
            </div>
            <div className="mt-5 intro-y box p-5">
                <div className="rounded border border-gray-300 p-5">
                    <p>{`The code must be placed before the closing </body> tag `}</p>
                    <p className="mt-4">{`<script> console.log('widget connecting'); </script>`}</p>
                </div>
            </div>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Скачать сайт объекта
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
                            {widgetData.map((object) => (
                                <option value={object.id}>{object.name}</option>
                            ))}
                        </TomSelect>
                    </div>
                    <Button
                        variant="primary"
                        className="col-span-12 sm:col-span-5 flex items-center justify-center shadow-md"
                    >
                        <Lucide
                            icon="Download"
                            className="size-5 mr-2 flex-shrink-0"
                        />
                        Скачать
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
