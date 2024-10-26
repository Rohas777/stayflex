import { useAppDispatch } from "@/stores/hooks";
import { type Menu } from "@/stores/menuSlice";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const menu: Array<Menu | "divider"> = [
    {
        icon: "Users",
        pathname: "/admin/",
        title: "Пользователи",
    },
    {
        icon: "Home",
        title: "Недвижимость",
        subMenu: [
            {
                icon: "Map",
                pathname: "/admin/regions",
                title: "Регионы",
            },
            {
                icon: "MapPin",
                pathname: "/admin/cities",
                title: "Города",
            },
            {
                icon: "Home",
                pathname: "/admin/property-types",
                title: "Типы недвижимости",
            },
            {
                icon: "Coffee",
                pathname: "/admin/amenities",
                title: "Удобства",
            },
            {
                icon: "Home",
                pathname: "/admin/objects",
                title: "Объекты",
            },
        ],
    },
    {
        icon: "Server",
        pathname: "/admin/servers",
        title: "Серверы",
    },
    {
        icon: "UserCheck",
        pathname: "/admin/clients",
        title: "Клиенты",
    },
    {
        icon: "Gem",
        pathname: "/admin/tariffs",
        title: "Тарифы",
    },
    {
        icon: "Calendar",
        pathname: "/admin/reservations",
        title: "Брони",
    },
    {
        icon: "Wrench",
        title: "Служебное",
        subMenu: [
            {
                icon: "Activity",
                pathname: "/admin/icon",
                title: "Иконки",
            },
        ],
    },
];

export default menu;
