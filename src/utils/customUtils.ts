export const startLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>,
    targetElement?: HTMLElement
) => {
    setIsLoaderOpen(true);
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

export const checkErrorsBase = (error: any) => {
    if (error.response.status === 401) {
        return "Ошибка авторизации";
    }
    if (error.code === "ERR_NETWORK") {
        return "Ошибка сети";
    }
    if (error.response.status === 500) {
        return "Внутренняя ошибка сервера";
    }
    if (error.response.status === 503) {
        return "Сервис недоступен";
    }
    if (error.response.status === 504) {
        return "Время ожидания истекло";
    }

    return false;
};

export const validateStartDaterange = (startDate: string, endDate: string) => {
    if (!startDate) {
        const error = "Обязательно выберите дату заезда";
        return {
            isValid: false,
            error: error,
        };
    }
    if (!new Date(startDate)) {
        const error = "Введите корректную дату заезда";
        return {
            isValid: false,
            error: error,
        };
    }
    if (formatDate(new Date(startDate)) < formatDate(new Date())) {
        const error = "Дата заезда не может быть раньше сегодняшней";
        return {
            isValid: false,
            error: error,
        };
    }
    if (formatDate(new Date(startDate)) > formatDate(new Date(endDate))) {
        const error = "Дата заезда не может быть позже даты выезда";
        return {
            isValid: false,
            error: error,
        };
    }
    return {
        isValid: true,
        error: null,
    };
};
export const validateEndDaterange = (startDate: string, endDate: string) => {
    if (!endDate) {
        const error = "Обязательно выберите дату выезда";
        return {
            isValid: false,
            error: error,
        };
    }
    if (!new Date(endDate)) {
        const error = "Введите корректную дату выезда";
        return {
            isValid: false,
            error: error,
        };
    }
    if (formatDate(new Date(endDate)) < formatDate(new Date())) {
        const error = "Дата выезда не может быть раньше сегодняшней";
        return {
            isValid: false,
            error: error,
        };
    }
    if (formatDate(new Date(startDate)) > formatDate(new Date(endDate))) {
        const error = "Дата выезда не может быть раньше даты заезда";
        return {
            isValid: false,
            error: error,
        };
    }
    if (new Date(endDate).getFullYear() > new Date().getFullYear() + 2) {
        const error = "Дата выезда не может быть больше 2-х лет";
        return {
            isValid: false,
            error: error,
        };
    }
    return {
        isValid: true,
        error: null,
    };
};

export const getDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }

    const differenceInMillis = end.getTime() - start.getTime();
    const days = differenceInMillis / (1000 * 60 * 60 * 24);
    return Math.floor(days);
};

export function dayTitle(number: number) {
    if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return "дней";
    const last_num = number % 10;
    if (last_num == 1) return "день";
    if ([2, 3, 4].includes(last_num)) return "дня";
    if ([5, 6, 7, 8, 9, 0].includes(last_num)) return "дней";
}
