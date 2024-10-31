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
import tippy from "tippy.js";
import { amenitySlice } from "@/stores/reducers/amenities/slice";
import {
    createAmenity,
    deleteAmenity,
    fetchAmenities,
} from "@/stores/reducers/amenities/actions";
import { Status } from "@/stores/reducers/types";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { ListPlus } from "lucide-react";
import AmenityForm from "./form";
import Notification from "@/components/Base/Notification";
import { AmenityCreateType } from "@/stores/reducers/amenities/types";
import Toastify from "toastify-js";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import { IconType } from "@/vars";
import ReactDOMServer from "react-dom/server";
import { errorToastSlice } from "@/stores/errorToastSlice";

window.DateTime = DateTime;
interface Response {
    id?: number;
    name?: string;
    icon?: string;
    object_count?: number;
}

function Main() {
    const [buttonModalPreview, setButtonModalPreview] = useState(false);
    const [isLoaderOpened, setIsLoaderOpened] = useState(false);
    const [amenityData, setAmenityData] = useState<{
        name: string;
        icon: string;
        id: number;
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
                            return `<div class="flex items-center justify-center">
                                ${
                                    response.icon &&
                                    ReactDOMServer.renderToString(
                                        takeLucideIcon(
                                            response.icon as IconType
                                        )
                                    )
                                }
                                        <div class="font-medium whitespace-nowrap">${
                                            response.name
                                        }</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Объекты",
                        minWidth: 200,
                        responsive: 0,
                        field: "object_count",
                        vertAlign: "middle",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        print: false,
                        download: false,
                        sorter: "string",
                        formatter(cell) {
                            const response: Response = cell.getData();
                            return `<div class="flex lg:justify-center">
                                        <div class="font-medium whitespace-nowrap">${response.object_count}</div>
                                    </div>`;
                        },
                    },
                    {
                        title: "Действия",
                        minWidth: 200,
                        field: "id",
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
                                setAmenityData({
                                    name: response.name!,
                                    icon: response.icon!,
                                    id: response.id!,
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

    const takeLucideIcon = (icon: IconType) => {
        return <Lucide className="size-7 mr-2" icon={icon} />;
    };

    const { amenities, status, error, isCreated, isDeleted } = useAppSelector(
        (state) => state.amenity
    );
    const amenityActions = amenitySlice.actions;
    const { setErrorToast } = errorToastSlice.actions;
    const dispatch = useAppDispatch();

    const onDelete = async () => {
        await dispatch(deleteAmenity(String(amenityData?.id)));
    };
    const onCreate = async (amenityData: AmenityCreateType) => {
        await dispatch(createAmenity(amenityData));
    };

    useEffect(() => {
        if (status === Status.ERROR && error) {
            dispatch(setErrorToast({ message: error, isError: true }));
            stopLoader(setIsLoaderOpened);

            dispatch(amenityActions.resetStatus());
        }
    }, [status, error]);
    useEffect(() => {
        let notificationText = "";
        if (isDeleted) {
            setDeleteConfirmationModal(false);
            notificationText = "Удобство успешно удалено";
        }
        if (isCreated) {
            setButtonModalPreview(false);
            notificationText = "Удобство успешно добавлено";
        }

        if (isCreated || isDeleted) {
            dispatch(fetchAmenities());

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

            dispatch(amenityActions.resetIsCreated());
            dispatch(amenityActions.resetIsDeleted());
            stopLoader(setIsLoaderOpened);
        }
    }, [isCreated, isDeleted]);
    useEffect(() => {
        initTabulator();
        reInitOnResizeWindow();

        dispatch(fetchAmenities());
    }, []);
    useEffect(() => {
        if (amenities && amenities.length) {
            const formattedData = amenities.map((amenity) => ({
                id: amenity.id,
                name: amenity.name,
                icon: amenity.icon,
                object_count: amenity.object_count,
            }));
            tabulator.current
                ?.setData(formattedData.reverse())
                .then(function () {
                    reInitTabulator();
                });
        }
    }, [amenities]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Удобства</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        className="mr-2 shadow-md"
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
            {/* BEGIN: HTML Table Data */}
            <div className="p-5 mt-5 intro-y box">
                {status === Status.LOADING && !isLoaderOpened && (
                    <div className="absolute z-[70] bg-slate-50 bg-opacity-70 flex justify-center items-center w-full h-full">
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
                        <div className="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
                            <label className="whitespace-nowrap flex-none mr-2 xl:w-auto xl:flex-initial">
                                Поиск по названию
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
                    {isLoaderOpened && <OverlayLoader />}
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Вы уверены?</div>
                        <div className="mt-2 text-slate-500">
                            Вы уверены, что хотите удалить удобство "
                            {amenityData?.name}"? <br />
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
                    <AmenityForm
                        onCreate={onCreate}
                        isLoaderOpened={isLoaderOpened}
                        setIsLoaderOpened={setIsLoaderOpened}
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
                        Удобство успешно добавлено
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
        </>
    );
}

export default Main;
