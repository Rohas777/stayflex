import { IMail } from "@/stores/models/IMail";
import Loader from "@/components/Custom/Loader/Loader";

interface MailPreviewProps {
    currentMail: IMail | null;
}

function MailPreview({ currentMail }: MailPreviewProps) {
    if (!currentMail) return <Loader />;

    return (
        <>
            <div className="p-5 min-h-96">
                <div className="mt-5 text-lg font-bold text-center">
                    {currentMail.name}
                </div>
                <div className="mt-5">
                    <div className="mt-3 border-b">
                        <h3 className="flex flex-col mb-2 w-full sm:flex-row text-xl">
                            {currentMail.subject}
                        </h3>
                    </div>
                    <div className="mt-3 text-box">
                        {currentMail.description}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MailPreview;
