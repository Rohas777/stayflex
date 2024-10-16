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
