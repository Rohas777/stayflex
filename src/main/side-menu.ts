import { type Menu } from "@/stores/menuSlice";
import en from "./../i18n/locales/en.json";
import ru from "./../i18n/locales/ru.json";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const lang = localStorage.getItem("language") == "en" ? en : ru;

const menu: Array<Menu | "divider"> = [
    {
        icon: "GanttChartSquare",
        pathname: "/scheduler",
        title: lang.menu.scheduler,
        mark: "experimental",
    },
    {
        icon: "Home",
        pathname: "/objects",
        title: lang.menu.objects,
    },
    {
        icon: "Gem",
        pathname: "/tariffs",
        title: lang.menu.tariffs,
    },
    {
        icon: "Link",
        pathname: "/channels",
        title: lang.menu.channels,
        mark: "experimental",
    },
    {
        icon: "UserCheck",
        pathname: "/clients",
        title: lang.menu.clients,
    },
    {
        icon: "Calendar",
        pathname: "/reservations",
        title: lang.menu.reservations,
    },
    {
        icon: "Airplay",
        pathname: "/widget",
        title: lang.menu.widget,
        mark: "experimental",
    },
];

export default menu;
