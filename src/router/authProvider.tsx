import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchAuthorizedUser } from "@/stores/reducers/users/actions";
import { startLoader } from "@/utils/customUtils";

function AuthProvider({ children }: { children: JSX.Element }) {
    const dispatch = useAppDispatch();
    const { authorizedUser } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAuthorizedUser());
    }, []);

    useEffect(() => {
        // if (!authorizedUser) {
        //     startLoader(setIsLoaderOpen);
        //     return
        // }
    }, [authorizedUser]);

    return children;
}

export default AuthProvider;
