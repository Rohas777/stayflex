import { type Menu } from "@/stores/menuSlice";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const menu: Array<Menu | "divider"> = [
    {
        icon: "Users",
        pathname: "/",
        title: "Пользователи",
    },
    {
        icon: "Home",
        title: "Недвижимость",
        subMenu: [
            {
                icon: "Map",
                pathname: "/regions",
                title: "Регионы",
            },
            {
                icon: "MapPin",
                pathname: "/cities",
                title: "Города",
            },
            {
                icon: "Home",
                pathname: "/property-types",
                title: "Типы недвижимости",
            },
            {
                icon: "Coffee",
                pathname: "/amenities",
                title: "Удобства",
            },
            {
                icon: "Home",
                pathname: "/admin-objects",
                title: "Объекты",
            },
        ],
    },
    {
        icon: "Server",
        pathname: "/servers",
        title: "Серверы",
    },
    {
        icon: "UserCheck",
        pathname: "/admin-clients",
        title: "Клиенты",
    },
    {
        icon: "Gem",
        pathname: "/tariffs-admin",
        title: "Тарифы",
    },
    {
        icon: "Calendar",
        pathname: "/admin-reservations",
        title: "Брони",
    },
    {
        icon: "Wrench",
        title: "Служебное",
        subMenu: [
            {
                icon: "Activity",
                pathname: "/icon",
                title: "Иконки",
            },
        ],
    },
    "divider",
    {
        icon: "Gem",
        pathname: "/tariffs",
        title: "Тарифы",
    },
    {
        icon: "Home",
        pathname: "/objects",
        title: "Объекты",
    },
    {
        icon: "Link",
        pathname: "/channels",
        title: "Каналы",
    },
    {
        icon: "UserCheck",
        pathname: "/clients",
        title: "Клиенты",
    },
    {
        icon: "Calendar",
        pathname: "/reservations",
        title: "Брони",
    },
    {
        icon: "Airplay",
        pathname: "/widget",
        title: "Виджет",
    },
];

export default menu;
