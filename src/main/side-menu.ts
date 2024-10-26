import { type Menu } from "@/stores/menuSlice";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const menu: Array<Menu | "divider"> = [
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
