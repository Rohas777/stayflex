import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import * as xlsx from "xlsx";
import { useEffect, useRef, createRef, useState } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { stringToHTML } from "@/utils/helper";
import { DateTime } from "luxon";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { userSlice } from "@/stores/reducers/users/slice";
import { deleteUser, fetchUsers } from "@/stores/reducers/users/actions";
import tippy from "tippy.js";
import { Link } from "react-router-dom";
import { regionSlice } from "@/stores/reducers/regions/slice";
import { createRegion, fetchRegions } from "@/stores/reducers/regions/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import RegionForm from "./form";
import { RegionCreateType } from "@/stores/reducers/regions/types";
import Notification from "@/components/Base/Notification";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    objects?: number;
}

function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isCreatePopup, setIsCreatePopup] = useState(true);
    const [regionData, setRegionData] = useState<{
        name: string;
        server: number;
    } | null>(null);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const [columnAcionFocusId, setcolumnAcionFocusId] = useState<number | null>(
        null
    );

    const tableRef = createRef<HTMLDivElement>();
    const tabulator = useRef<Tabulator>();
    const [filter, setFilter] = useState({
        field: "name",
        type: "like",
        value: "",
    });

    const [tableData, setTableData] = useState<Response[]>([]);

    const initTabulator = () => {
        if (tableRef.current) {
            tabulator.current = new Tabulator(tableRef.current, {
                reactiveData: true,
                data: tableData,
                paginationMode: "local",
                filterMode: "local",
                sortMode: "local",
                printAsHtml: true,
                printStyled: true,
                pagination: true,
                paginationSize: 10,
                paginationSizeSelector: [10, 20, 50, 100],
                layout: "fitColumns",
                responsiveLayout: "collapse",
                placeholder: "No matching records found",
                columns: [
                    {
                        title: "",
                        field: "id",
                        formatter: "responsiveCollapse",
                        width: 40,
                        minWidth: 30,
                        hozAlign: "center",
                        resizable: false,
                        headerSort: false,
                    },

                    // For HTML table
                    {
                        title: "НАЗВАНИЕ",
                        minWidth: 200,
                        responsive: 0,
                        field: "name",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div>
                                        <div class="font-medium whitespace-nowrap">${response.name}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "ОБЪЕКТЫ",
                        minWidth: 200,
                        field: "objects",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.objects}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "",
                        minWidth: 200,
                        field: "",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        resizable: false,
                        headerSort: false,
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex lg:justify-center items-center"></div>`
                            );
                            const editA =
                                stringToHTML(`<a class="flex items-center mr-3 w-7 h-7 p-1 border border-black rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="pencil"></i>
                              </a>`);
                            const deleteA =
                                stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                            tippy(editA, {
                                content: "Редактировать",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            tippy(deleteA, {
                                content: "Удалить",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            a.append(editA, deleteA);
                            a.addEventListener("hover", function () {});
                            deleteA.addEventListener("click", function () {
                                setDeleteConfirmationModal(true);
                                const rowId = cell.getRow().getData().id;
                                setRegionData({
                                    name: response.name!,
                                    server: 3,
                                });
                                setcolumnAcionFocusId(rowId);
                            });
                            editA.addEventListener("click", function (event) {
                                event.preventDefault();
                                const row = tableData.find(
                                    (row) => row.id === response.id
                                );
                                setRegionData({
                                    name: response.name!,
                                    server: 3,
                                });
                                setIsCreatePopup(false);
                                setButtonModalPreview(true);
                            });
                            return a;
                        },
                    },

                    // For print format
                    {
                        title: "NAME",
                        field: "name",
                        visible: false,
                        print: true,
                        download: true,
                    },
                    {
                        title: "OBJECTS",
                        field: "objects",
                        visible: false,
                        print: true,
                        download: true,
                    },
                ],
            });
        }

        tabulator.current?.on("renderComplete", () => {
            createIcons({
                icons,
                attrs: {
                    "stroke-width": 1.5,
                },
                nameAttr: "data-lucide",
            });
        });
    };

    // Redraw table onresize
    const reInitOnResizeWindow = () => {
        window.addEventListener("resize", () => {
            if (tabulator.current) {
                tabulator.current.redraw();
                createIcons({
                    icons,
                    attrs: {
                        "stroke-width": 1.5,
                    },
                    nameAttr: "data-lucide",
                });
            }
        });
    };

    const reInitTabulator = () => {
        if (tabulator.current) {
            tabulator.current.redraw();
            createIcons({
                icons,
                attrs: {
                    "stroke-width": 1.5,
                },
                nameAttr: "data-lucide",
            });
        }
    };

    const onFilter = () => {
        if (tabulator.current) {
            tabulator.current.setFilter(
                filter.field,
                filter.type,
                filter.value
            );
        }
    };
    const onResetFilter = () => {
        setFilter({
            ...filter,
            field: "name",
            type: "like",
            value: "",
        });
        onFilter();
    };

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

    const onDelete = () => {
        if (columnAcionFocusId) {
            dispatch(deleteUser(String(columnAcionFocusId)));
            reInitTabulator();
            setDeleteConfirmationModal(false);
        }
    };

    const onCreate = (region: RegionCreateType) => {
        dispatch(createRegion(region));
        dispatch(fetchRegions());
        setButtonModalPreview(false);
    };
    const onUpdate = (region: RegionCreateType) => {
        // dispatch(createRegion(region));
        // dispatch(fetchRegions());
        // setButtonModalPreview(false);
    };
    const { regions, status, error } = useAppSelector((state) => state.region);
    const {} = regionSlice.actions;
    const dispatch = useAppDispatch();

    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchRegions());
    }, []);
    useEffect(() => {
        if (regions.length) {
            const formattedData = regions.map((region) => ({
                id: region.id,
                name: region.name,
                objects: Math.floor(Math.random() * 101),
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [regions]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Регионы</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setIsCreatePopup(true);
                            setButtonModalPreview(true);
                        }}
                    >
                        <ListPlus className="size-5 mr-2" />
                        Добавить
                    </Button>
                </div>
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && (
                    <div className="absolute z-50 bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
                    <form
                        id="tabulator-html-filter-form"
                        className="xl:flex sm:mr-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFilter();
                        }}
                    >
                        <div className="items-center sm:flex sm:mr-4">
                            <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                                Поле
                            </label>
                            <FormSelect
                                id="tabulator-html-filter-field"
                                value={filter.field}
                                onChange={(e) => {
                                    setFilter({
                                        ...filter,
                                        field: e.target.value,
                                    });
                                }}
                                className="w-full mt-2 2xl:w-full sm:mt-0 sm:w-auto"
                            >
                                <option value="name">Название</option>
                                <option value="objects">Объекты</option>
                            </FormSelect>
                        </div>
                        <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                                Тип
                            </label>
                            <FormSelect
                                id="tabulator-html-filter-type"
                                value={filter.type}
                                onChange={(e) => {
                                    setFilter({
                                        ...filter,
                                        type: e.target.value,
                                    });
                                }}
                                className="w-full mt-2 sm:mt-0 sm:w-auto"
                            >
                                <option value="like">like</option>
                                <option value="=">=</option>
                                <option value="<">&lt;</option>
                                <option value="<=">&lt;=</option>
                                <option value=">">&gt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="!=">!=</option>
                            </FormSelect>
                        </div>
                        <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="flex-none w-12 mr-2 xl:w-auto xl:flex-initial">
                                Значение
                            </label>
                            <FormInput
                                id="tabulator-html-filter-value"
                                value={filter.value}
                                onChange={(e) => {
                                    setFilter({
                                        ...filter,
                                        value: e.target.value,
                                    });
                                }}
                                type="text"
                                className="mt-2 sm:w-40 2xl:w-full sm:mt-0"
                                placeholder="Поиск..."
                            />
                        </div>
                        <div className="mt-2 xl:mt-0">
                            <Button
                                id="tabulator-html-filter-go"
                                variant="primary"
                                type="button"
                                className="w-full sm:w-16"
                                onClick={onFilter}
                            >
                                Начать
                            </Button>
                            <Button
                                id="tabulator-html-filter-reset"
                                variant="secondary"
                                type="button"
                                className="w-full mt-2 sm:w-20 sm:mt-0 sm:ml-1"
                                onClick={onResetFilter}
                            >
                                Сбросить
                            </Button>
                        </div>
                    </form>
                    <div className="flex mt-5 sm:mt-0">
                        <Menu className="w-1/2 sm:w-auto">
                            <Menu.Button
                                as={Button}
                                variant="outline-secondary"
                                className="w-full sm:w-auto"
                            >
                                <Lucide
                                    icon="FileText"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Экспорт
                                <Lucide
                                    icon="ChevronDown"
                                    className="w-4 h-4 ml-auto sm:ml-2"
                                />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                                <Menu.Item onClick={onExportCsv}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт CSV
                                </Menu.Item>
                                <Menu.Item onClick={onExportJson}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт JSON
                                </Menu.Item>
                                <Menu.Item onClick={onExportXlsx}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт XLSX
                                </Menu.Item>
                                <Menu.Item onClick={onExportHtml}>
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Экспорт HTML
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hidden">
                    <div id="tabulator" ref={tableRef} className="mt-5"></div>
                </div>
            </div>
            {/* END: HTML Table Data */}

            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Вы уверены?</div>
                        <div className="mt-2 text-slate-500">
                            Вы уверены, что хотите удалить регион "
                            {regionData?.name}"? <br />
                            Это действие нельзя будет отменить.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-24"
                            onClick={() => {
                                onDelete();
                            }}
                        >
                            Удалить
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
            {/* BEGIN: Modal Content */}
            <Dialog
                open={buttonModalPreview}
                onClose={() => {
                    setButtonModalPreview(false);
                    setRegionData(null);
                }}
            >
                <Dialog.Panel>
                    <a
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setButtonModalPreview(false);
                        }}
                        className="absolute top-0 right-0 mt-3 mr-3"
                        href="#"
                    >
                        <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                    </a>
                    <RegionForm
                        isCreate={isCreatePopup}
                        regionData={{
                            name: regionData ? regionData.name! : "",
                            server: regionData ? regionData.server : 1,
                        }}
                        onCreate={onCreate}
                        onUpdate={onUpdate}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex hidden"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Регион успешно добавлен</div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
