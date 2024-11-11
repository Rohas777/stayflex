import { DropzoneElement } from "@/components/Base/Dropzone";
import { DropzoneFile } from "dropzone";

/**
 * Устанавливает флаг, что загрузчик должен быть показан,
 *
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoaderOpen - функция, которая изменяет состояние
 */
export const startLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoaderOpen(true);
};

/**
 * Устанавливает флаг, что загрузчик должен быть скрыт.
 *
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsLoaderOpen - функция, которая изменяет состояние
 */
export const stopLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoaderOpen(false);
};

/**
 * Конвертирует строку в формате '2022-01-01' в строку в формате '01.01.2022'
 * @param {string} str - строка в формате '2022-01-01'
 * @returns {string} - строка в формате '01.01.2022'
 */
export const convertDateString = (str: string) => {
    const [year, month, day] = str.split("-");
    return `${day}.${month}.${year}`;
};

/**
 * Форматирует дату в формат "Д ммм., ГГГГ", где
 * ммм. - месяц в виде тр - х букв
 * @param {Date} date - дата
 * @returns {string} отформатированная дата
 */
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

/**
 * Форматирует дату в формат "ГГГГ-ММ-ДД"
 * @param {Date} date - дата
 * @returns {string} отформатированная дата
 */
export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Функция проверяет ответ сервера и возвращает базовые ошибки по кодам
 *
 * @param {Object} error - объект ошибки
 * @returns {String | Boolean} - текст ошибки или false
 */
export const checkErrorsBase = (error: any) => {
    if (error.response.status === 401) {
        return "Ошибка авторизации";
    }
    if (error.code === "ERR_NETWORK") {
        return "Ошибка сети";
    }
    if (error.code === "ERR_NAME_NOT_RESOLVED") {
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

/**
 * Проверяет корректность даты заезда.
 *
 * @param startDate - дата заезда в формате строки.
 * @param endDate - дата выезда в формате строки.
 *
 * @returns Объект с полем `isValid`, указывающим на валидность даты заезда,
 *          и полем `error`, содержащим сообщение об ошибке, если дата заезда
 *          некорректна.
 *
 * Ошибки:
 * - "Обязательно выберите дату заезда" - если дата заезда не указана.
 * - "Введите корректную дату заезда" - если дата заезда неверна.
 * - "Дата заезда не может быть раньше сегодняшней" - если дата заезда раньше
 *   сегодняшней.
 * - "Дата заезда не может быть позже даты выезда" - если дата заезда позже
 *   даты выезда.
 */
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

/**
 * Проверяет корректность даты выезда.
 *
 * @param startDate - дата заезда в формате строки.
 * @param endDate - дата выезда в формате строки.
 *
 * @returns Объект с полем `isValid`, указывающим на валидность даты выезда,
 *          и полем `error`, содержащим сообщение об ошибке, если дата выезда
 *          некорректна.
 *
 * Ошибки:
 * - "Обязательно выберите дату выезда" - если дата выезда не указана.
 * - "Введите корректную дату выезда" - если дата выезда неверна.
 * - "Дата выезда не может быть раньше сегодняшней" - если дата выезда раньше текущей.
 * - "Дата выезда не может быть раньше даты заезда" - если дата выезда раньше даты заезда.
 * - "Дата выезда не может быть больше 2-х лет" - если дата выезда более чем на 2 года в будущем.
 */
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

/**
 * @description
 * Возвращает количество целых дней между двумя датами.
 * @param {string} startDate - дата начала
 * @param {string} endDate - дата конца
 * @returns {number} количество целых дней
 */
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

/**
 * @description
 * Проверяет, находится ли переданный диапазон дат в зоне блокировки.
 * @param {string} startDate - дата начала
 * @param {string} endDate - дата конца
 * @param {Array<{id: number, start_date: string, end_date: string}>} lockDays - массив объектов, каждый из которых
 *  содержит id, start_date и end_date, которые указывают на зону блокировки
 * @param {number} [excludeId] - необязательный параметр, который указывает на id, который нужно пропустить
 * @returns {boolean} true, если диапазон находится в зоне блокировки, false - если нет
 *
 */

export const isDateRangeLocked = (
    startDate: string,
    endDate: string,
    lockDays: { id: number; start_date: string; end_date: string }[],
    excludeId?: number
): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (const lock of lockDays) {
        if (excludeId && lock.id === excludeId) {
            continue;
        }

        const lockStart = new Date(lock.start_date);
        const lockEnd = new Date(lock.end_date);

        if (start <= lockEnd && end >= lockStart) {
            return true;
        }
    }
    return false;
};

/**
 * Возвращает строку, соответствующую количеству дней, с
 * правильным склонением.
 *
 * @param number - количество дней
 * @returns строка, соответствующая количеству дней, с
 *          правильным склонением
 */
export function dayTitle(number: number) {
    if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return "дней";
    const last_num = number % 10;
    if (last_num == 1) return "день";
    if ([2, 3, 4].includes(last_num)) return "дня";
    if ([5, 6, 7, 8, 9, 0].includes(last_num)) return "дней";
}

/**
 * Асинхронная функция, которая принимает массив файлов, полученных
 * из dropzone, и ReactRef на DropzoneElement (если он есть). Она
 * масштабирует изображения, если их ширина или высота превышает 1920
 * или 1080 пикселей соответственно, и возвращает массив
 * отмасштабированных файлов.
 *
 * @param photos - массив файлов, полученных из dropzone
 * @param dropzoneRef - ReactRef на DropzoneElement
 * @returns отмасштабированные файлы
 */

export interface ImageDropzoneFile extends DropzoneFile {
    width: number;
    height: number;
}
export const resizeDropzoneFiles = async (
    photos: ImageDropzoneFile[],
    dropzoneRef: React.MutableRefObject<DropzoneElement | undefined>
): Promise<File[]> => {
    const files: File[] = [];

    await Promise.all(
        photos.map(
            (file) =>
                new Promise<void>((resolve, reject) => {
                    if (file.height <= 1080 && file.width <= 1920) {
                        files.push(file);
                        resolve();
                        return;
                    }
                    const name = file.name;
                    dropzoneRef.current?.dropzone.resizeImage(
                        file,
                        1920,
                        1080,
                        "contain",
                        (resizedFile) => {
                            try {
                                const output = new File([resizedFile], name, {
                                    type: resizedFile.type,
                                    lastModified: Date.now(),
                                });
                                files.push(output);
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                })
        )
    );

    return files;
};
