import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import * as xlsx from "xlsx";
import { Tabulator } from "tabulator-tables";

function ExportMenu({
    tabulator,
}: {
    tabulator: React.MutableRefObject<Tabulator | undefined>;
}) {
    const onExportCsv = () => {
        if (tabulator.current) {
            tabulator.current.download("csv", "data.csv");
        }
    };
    const onExportJson = () => {
        if (tabulator.current) {
            tabulator.current.download("json", "data.json");
        }
    };
    const onExportXlsx = () => {
        if (tabulator.current) {
            (window as any).XLSX = xlsx;
            tabulator.current.download("xlsx", "data.xlsx", {
                sheetName: "Users",
            });
        }
    };
    const onExportHtml = () => {
        if (tabulator.current) {
            tabulator.current.download("html", "data.html", {
                style: true,
            });
        }
    };

    return (
        <>
            <Menu className="shadow-md">
                <Menu.Button as={Button} variant="secondary">
                    <Lucide icon="FileText" className="w-4 h-4" />{" "}
                    <Lucide
                        icon="ChevronDown"
                        className="w-4 h-4 ml-auto sm:ml-2"
                    />
                </Menu.Button>
                <Menu.Items className="w-40">
                    <Menu.Item onClick={onExportCsv}>
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                        Экспорт CSV
                    </Menu.Item>
                    <Menu.Item onClick={onExportJson}>
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                        Экспорт JSON
                    </Menu.Item>
                    <Menu.Item onClick={onExportXlsx}>
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                        Экспорт XLSX
                    </Menu.Item>
                    <Menu.Item onClick={onExportHtml}>
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                        Экспорт HTML
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </>
    );
}

export default ExportMenu;
