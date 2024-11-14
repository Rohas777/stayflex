import Icon from "../Icon";

function OnDevMark({
    type = "experimental",
}: {
    type?: "experimental" | "new";
}) {
    return (
        <div className="w-full bg-pending relative text-white rounded-md flex justify-center items-center py-2">
            Эта страница в доработке (пока что)
            <Icon className="size-7 ml-2" icon="Wrench" />
        </div>
    );
}

export default OnDevMark;
