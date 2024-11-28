import { type Menu } from "@/stores/menuSlice";
import en from "./../i18n/locales/en.json";
import ru from "./../i18n/locales/ru.json";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const lang = localStorage.getItem("language") == "en" ? en : ru;

const menu: Array<Menu | "divider"> = [
    {
        icon: "UserCog",
        pathname: "/admin/",
        title: lang.menu.admins,
    },
    {
        icon: "Users",
        pathname: "/admin/users",
        title: lang.menu.users,
    },
    {
        icon: "Home",
        pathname: "/admin/objects",
        title: lang.menu.objects,
    },
    {
        icon: "UserCheck",
        pathname: "/admin/clients",
        title: lang.menu.clients,
    },
    {
        icon: "Calendar",
        pathname: "/admin/reservations",
        title: lang.menu.reservations,
    },
    {
        icon: "FileArchive",
        pathname: "/admin/logs",
        title: lang.menu.logs,
    },
    {
        icon: "Wrench",
        title: lang.menu.settings,
        subMenu: [
            {
                icon: "Map",
                pathname: "/admin/regions",
                title: lang.menu.regions,
            },
            {
                icon: "MapPin",
                pathname: "/admin/cities",
                title: lang.menu.cities,
            },
            {
                icon: "Home",
                pathname: "/admin/property-types",
                title: lang.menu.property_types,
            },
            {
                icon: "Coffee",
                pathname: "/admin/amenities",
                title: lang.menu.amenities,
            },
            {
                icon: "Tags",
                pathname: "/admin/hashtags",
                title: lang.menu.hashtags,
            },
            {
                icon: "Server",
                pathname: "/admin/servers",
                title: lang.menu.servers,
            },
            {
                icon: "Gem",
                pathname: "/admin/tariffs",
                title: lang.menu.tariffs,
            },
            {
                icon: "Mail",
                pathname: "/admin/mails",
                title: lang.menu.mails,
            },
            {
                icon: "Activity",
                pathname: "/admin/icon",
                title: lang.menu.icons,
            },
        ],
    },
];

export default menu;
