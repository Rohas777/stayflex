import { GetThunkAPI } from "@reduxjs/toolkit";
import { useLayoutEffect } from "react";
import { lock, unlock } from "tua-body-scroll-lock";

export const startLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>,
    targetElement?: HTMLElement
) => {
    setIsLoaderOpen(true);
    // lock(targetElement);
};
export const stopLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>,
    targetElement?: HTMLElement
) => {
    setIsLoaderOpen(false);
    // unlock(targetElement);
};

export const convertDateString = (str: string) => {
    const [year, month, day] = str.split("-");
    return `${day}.${month}.${year}`;
};

export const formatDatePretty = (date: Date) => {
    const months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}., ${year}`;
};

export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const checkErrorsBase = (status: number) => {
    if (status === 500) {
        return "Внутренняя ошибка сервера";
    }
    if (status === 503) {
        return "Сервис недоступен";
    }
    if (status === 504) {
        return "Время ожидания истекло";
    }

    return "Внутренняя ошибка сервера";
};
