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
import {
    createRegion,
    deleteRegion,
    fetchRegions,
} from "@/stores/reducers/regions/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import RegionForm from "./form";
import { RegionCreateType } from "@/stores/reducers/regions/types";
import Notification from "@/components/Base/Notification";
import Toastify from "toastify-js";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { errorToastSlice } from "@/stores/errorToastSlice";
import ExportMenu from "@/components/Custom/ExportMenu";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    objects?: number;
    server?: string;
    city_count?: number;
}

function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [regionData, setRegionData] = useState<{
        id: number;
        name: string;
        server: number;
    } | null>(null);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);

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
                placeholder: "Записи не найдены",
                columns: [
                    {
                        title: "",
                        field: "",
                        formatter: "responsiveCollapse",
                        width: 40,
                        minWidth: 30,
                        hozAlign: "center",
                        resizable: false,
                        headerSort: false,
                    },

                    // For HTML table
                    {
                        title: "Название",
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
                        title: "Города",
                        minWidth: 200,
                        field: "city_count",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "number",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.city_count}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Объекты",
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
                        title: "Сервер",
                        minWidth: 200,
                        field: "server",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        vertAlign: "middle",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.server}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Действия",
                        minWidth: 200,
                        field: "actions",
                        responsive: 1,
                        hozAlign: "right",
                        headerHozAlign: "right",
                        vertAlign: "middle",
                        resizable: false,
                        headerSort: false,
                        formatter(cell) {
                            const response: Response = cell.getData();
                            const a = stringToHTML(
                                `<div class="flex lg:justify-center items-center"></div>`
                            );
                            const deleteA =
                                stringToHTML(`<a class="flex items-center text-danger w-7 h-7 p-1 border border-danger rounded-md hover:opacity-70" href="javascript:;">
                                <i data-lucide="trash-2"></i>
                              </a>`);
                            tippy(deleteA, {
                                content: "Удалить",
                                placement: "bottom",
                                animation: "shift-away",
                            });
                            a.append(deleteA);
                            deleteA.addEventListener("click", function () {
                                setDeleteConfirmationModal(true);
                                setRegionData({
                                    id: response.id!,
                                    name: response.name!,
                                    server: 3,
                                });
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
            tabulator.current.setFilter("name", "like", filter.value);
        }
    };
    const onResetFilter = () => {
        setFilter({
            ...filter,
            field: "name",
            type: "like",
            value: "",
        });
        if (tabulator.current) {
            tabulator.current.setFilter("name", "like", "");
        }
    };

    const { regions, status, error, isCreated, isDeleted } = useAppSelector(
        (state) => state.region
    );
    const regionsActions = regionSlice.actions;
    const { setErrorToast } = errorToastSlice.actions;
    const dispatch = useAppDispatch();

    const onDelete = () => {
        dispatch(deleteRegion(String(regionData?.id)));
    };

    const onCreate = (region: RegionCreateType) => {
        dispatch(createRegion(region));
    };

    useEffect(() => {
        if (status === Status.ERROR) {
            dispatch(setErrorToast({ message: error!, isError: true }));
            dispatch(regionsActions.resetStatus());
            stopLoader(setIsLoaderOpened);
        }
    }, [status]);

    useEffect(() => {
        let notificationText = "";
        if (isDeleted) {
            setDeleteConfirmationModal(false);
            notificationText = "Регион успешно удалён";
        }
        if (isCreated) {
            setButtonModalPreview(false);
            notificationText = "Регион успешно добавлен";
        }

        if (isCreated || isDeleted) {
            dispatch(fetchRegions());

            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");

            successEl.querySelector(".text-content")!.textContent =
                notificationText;
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();

            dispatch(regionsActions.resetIsCreated());
            dispatch(regionsActions.resetIsDeleted());
            stopLoader(setIsLoaderOpened);
        }
    }, [isCreated, isDeleted]);

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
                objects: region.object_count,
                server: region.servers.name,
                city_count: region.cities.length,
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
            <div className="flex items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Регионы</h2>
                <ExportMenu tabulator={tabulator} />
            </div>
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && !isLoaderOpened && (
                    <div className="absolute z-50 bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
                        <div className="w-10 h-10">
                            <LoadingIcon icon="ball-triangle" />
                        </div>
                    </div>
                )}
                <div className="flex flex-col-reverse sm:flex-row sm:items-end xl:items-start">
                    <form
                        id="tabulator-html-filter-form"
                        className="xl:flex sm:mr-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFilter();
                        }}
                    >
                        <div className="flex items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="whitespace-nowrap flex-none mr-2 xl:w-auto xl:flex-initial">
                                <Lucide icon="Search" className="w-4 h-4" />
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
                    <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                        <Button
                            as="a"
                            href="#"
                            variant="primary"
                            className="w-full shadow-md"
                            onClick={(event: React.MouseEvent) => {
                                event.preventDefault();
                                setButtonModalPreview(true);
                            }}
                        >
                            <ListPlus className="size-5 mr-2" />
                            Добавить
                        </Button>
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
                    {isLoaderOpened && <OverlayLoader />}
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
                                startLoader(setIsLoaderOpened);
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
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
                        onCreate={onCreate}
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
                    <div className="font-medium text-content">
                        Регион успешно добавлен
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
