import { type Menu } from "@/stores/menuSlice";

const newReservationsIndicator = document.createElement("span");
newReservationsIndicator.classList.add("rounded-full", "size-5", "bg-success");
newReservationsIndicator.textContent = "1";

const menu: Array<Menu | "divider"> = [];

export default menu;
