import { useState } from "react";

const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const copyToClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Не удалось скопировать текст: ", err);
            setIsCopied(false);
        }
    };

    return [isCopied, copyToClipboard];
};

export default useCopyToClipboard;
