import { lock, unlock } from "tua-body-scroll-lock";

export const startLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoaderOpen(true);
    lock();
};
export const stopLoader = (
    setIsLoaderOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsLoaderOpen(false);
    unlock();
};

export const convertDateString = (str: string) => {
    const [year, month, day] = str.split("-");
    return `${day}.${month}.${year}`;
};
